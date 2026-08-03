from google import genai
from sqlalchemy.orm import Session
from sqlalchemy import select, asc
from ...core.config import settings
from ...modules.users.models import User
from ..captures.models import Capture
from .models import AIConversation, AIMessage, AIEmbedding
from .schemas import ChatRequest, Citation
from ...core.ai.router import ai_router

def chat_with_rag(db: Session, user: User, chat_req: ChatRequest) -> tuple[AIConversation, AIMessage, list[Citation]]:
    from fastapi import HTTPException
    from ..billing import entitlements, quota_service
    
    if not entitlements.check_quota(db, user.id, "ai_requests_monthly"):
        raise HTTPException(status_code=403, detail="Monthly AI request limit reached. Please upgrade to continue chatting.")
        
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured")
        
    # 1. Embed user message if there is text
    results = []
    if chat_req.message.strip():
        user_query_embedding = ai_router.generate_embedding(text=chat_req.message)
        
        # 2. Retrieve top most similar captures
        # Apply Memory Filter rules
        from ..filters.models import MemoryFilterSettings
        filter_settings = db.query(MemoryFilterSettings).filter(MemoryFilterSettings.user_id == user.id).first()
        
        query = db.query(
            Capture, 
            AIEmbedding,
            AIEmbedding.embedding.cosine_distance(user_query_embedding).label("distance")
        ).join(
            AIEmbedding, Capture.id == AIEmbedding.capture_id
        ).filter(
            Capture.deleted_at == None
        )
        
        if filter_settings:
            if filter_settings.hide_workspace_memories and not chat_req.workspace_id:
                from ..collaboration.models import SharedCapture
                subq = db.query(SharedCapture.capture_id).subquery()
                query = query.filter(Capture.id.notin_(subq))
            
            if not filter_settings.ai_context_pinned:
                # If they don't want pinned in AI context explicitly, we just don't boost it.
                # However, if they have some "hide" rule we would apply it here.
                pass
                
            # Could add a date filter if ai_context_recent is false, but by default we search all.
            # Realistically, semantic search will find relevant regardless of date unless specifically restricted.
        
        if chat_req.workspace_id:
            from ..collaboration.models import SharedCapture
            query = query.join(SharedCapture, SharedCapture.capture_id == Capture.id).filter(
                SharedCapture.workspace_id == chat_req.workspace_id
            )
        else:
            query = query.filter(Capture.user_id == user.id)
            
        semantic_results = query.order_by("distance").limit(10 if (filter_settings and filter_settings.show_important_first) else 5).all()
        
        # 2.1 Fetch most recent captures (real-time awareness regardless of semantic match)
        recent_query = db.query(Capture).filter(Capture.deleted_at == None)
        if chat_req.workspace_id:
            recent_query = recent_query.join(SharedCapture, SharedCapture.capture_id == Capture.id).filter(
                SharedCapture.workspace_id == chat_req.workspace_id
            )
        else:
            recent_query = recent_query.filter(Capture.user_id == user.id)
            
        recent_captures = recent_query.order_by(Capture.created_at.desc()).limit(5).all()
        
        # Merge semantic and recent, avoiding duplicates
        seen_ids = set()
        for cap, emb, dist in semantic_results:
            results.append((cap, emb, dist))
            seen_ids.add(cap.id)
            
        for cap in recent_captures:
            if cap.id not in seen_ids:
                results.append((cap, None, 1.0)) # 1.0 distance means it's just appended as recent
                seen_ids.add(cap.id)

    
    citations = []
    context_texts = []
    
    # 2.5 Fetch forcefully attached context (e.g. uploaded in chat box)
    if chat_req.attached_capture_ids:
        query = db.query(Capture).filter(
            Capture.id.in_(chat_req.attached_capture_ids)
        )
        if chat_req.workspace_id:
            from ..collaboration.models import SharedCapture
            query = query.join(SharedCapture, SharedCapture.capture_id == Capture.id).filter(
                SharedCapture.workspace_id == chat_req.workspace_id
            )
        else:
            query = query.filter(Capture.user_id == user.id)
            
        attached_captures = query.all()
        for capture in attached_captures:
            context_texts.append(f"[ATTACHED FILE] Date: {capture.created_at.isoformat()}\nContent: {capture.content_text}")

    for capture, embedding, distance in results:
        # Skip if already attached
        if chat_req.attached_capture_ids and capture.id in chat_req.attached_capture_ids:
            continue
            
        similarity_score = 1 - distance # Cosine similarity = 1 - Cosine distance
        citations.append(Citation(
            capture_id=capture.id,
            content=capture.content_text,
            similarity_score=similarity_score
        ))
        context_texts.append(f"Date: {capture.created_at.isoformat()}\nContent: {capture.content_text}")
    
    context_str = "\n\n".join(context_texts) if context_texts else "No specific past context found."
    
    # 2.6 Fetch recent unread notifications for context
    # 2.6 Fetch recent unread notifications for context (Skip for workspace AI for now, or fetch workspace notifs)
    from ..notifications.models import Notification
    query_notifs = db.query(Notification).filter(
        Notification.user_id == user.id,
        Notification.is_read == False,
        Notification.is_archived == False
    )
    if chat_req.workspace_id:
        query_notifs = query_notifs.filter(Notification.workspace_id == chat_req.workspace_id) if hasattr(Notification, 'workspace_id') else query_notifs.filter(False) # Empty if no workspace notifs yet

    recent_notifs = query_notifs.order_by(Notification.created_at.desc()).limit(10).all()
    
    if recent_notifs:
        notif_context = "\n--- RECENT UNREAD NOTIFICATIONS ---\n"
        for notif in recent_notifs:
            notif_context += f"Type: {notif.type}, Title: {notif.title}, Content: {notif.content}\n"
        context_str += notif_context
        
    # 2.7 Fetch active Reminders/Tasks for context
    from ..automation.models import Reminder
    query_reminders = db.query(Reminder).filter(
        Reminder.status == "pending"
    )
    if chat_req.workspace_id:
        query_reminders = query_reminders.filter(Reminder.workspace_id == chat_req.workspace_id) if hasattr(Reminder, 'workspace_id') else query_reminders.filter(False)
    else:
        query_reminders = query_reminders.filter(Reminder.user_id == user.id)
        
    active_reminders = query_reminders.order_by(Reminder.due_date.asc().nulls_last()).limit(10).all()
    
    if active_reminders:
        reminder_context = "\n--- ACTIVE TASKS & REMINDERS ---\n"
        for r in active_reminders:
            reminder_context += f"Task: {r.title}, Priority: {r.priority}, Due: {r.due_date.isoformat() if r.due_date else 'No Date'}\n"
        context_str += reminder_context
    
    # 3. Handle Conversation
    conversation_id = chat_req.conversation_id
    past_messages = []
    if not conversation_id:
        conversation = AIConversation(
            user_id=user.id, 
            title=chat_req.message[:50],
            workspace_id=chat_req.workspace_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        conversation_id = conversation.id
    else:
        conversation = db.query(AIConversation).filter(AIConversation.id == conversation_id, AIConversation.user_id == user.id).first()
        if not conversation:
            raise ValueError("Conversation not found")
        # Fetch history
        past_msgs = db.query(AIMessage).filter(AIMessage.conversation_id == conversation_id).order_by(asc(AIMessage.created_at)).all()
        for msg in past_msgs:
            role = "user" if msg.role == "user" else "model"
            past_messages.append({"role": role, "parts": [{"text": msg.content}]})
            
    # 4. Construct prompt using Centralized Persona Engine
    from ..persona.prompt_builder import build_system_prompt
    
    task_context = f"""Use the following retrieved context from the user's past notes and memories to answer their query.
If the context doesn't contain the answer, you can still be helpful, but prioritize the user's context.
ALWAYS cite the memories if you use them.

--- RETRIEVED CONTEXT ---
{context_str}
"""
    system_instruction = build_system_prompt(db, user, task_context)
    
    # 5. Generate response with AIRouter
    contents = past_messages
    user_prompt = chat_req.message if chat_req.message.strip() else "Please analyze the attached context."
    contents.append({"role": "user", "content": user_prompt})
    
    assistant_reply = ai_router.generate_chat(
        task="ask",
        messages=contents,
        system_prompt=system_instruction
    )
    
    # 6. Store messages
    user_msg = AIMessage(
        conversation_id=conversation_id,
        role="user",
        content=chat_req.message,
        attachments=[str(aid) for aid in chat_req.attached_capture_ids] if chat_req.attached_capture_ids else None,
        status="completed"
    )
    db.add(user_msg)
    
    assistant_msg = AIMessage(
        conversation_id=conversation_id,
        role="assistant",
        content=assistant_reply
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    
    quota_service.increment_ai_requests(db, user.id)
    
    return conversation, assistant_msg, citations
