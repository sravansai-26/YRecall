from google import genai
from sqlalchemy.orm import Session
from sqlalchemy import select, asc
from ...core.config import settings
from ...modules.users.models import User
from ..captures.models import Capture
from .models import AIConversation, AIMessage, AIEmbedding
from .schemas import ChatRequest, Citation

def chat_with_rag(db: Session, user: User, chat_req: ChatRequest) -> tuple[AIConversation, AIMessage, list[Citation]]:
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    # 1. Embed user message if there is text
    results = []
    if chat_req.message.strip():
        embed_result = client.models.embed_content(
            model="gemini-embedding-2",
            contents=chat_req.message
        )
        user_query_embedding = embed_result.embeddings[0].values
        
        # 2. Retrieve top 5 most similar captures
        results = db.query(
            Capture, 
            AIEmbedding,
            AIEmbedding.embedding.cosine_distance(user_query_embedding).label("distance")
        ).join(
            AIEmbedding, Capture.id == AIEmbedding.capture_id
        ).filter(
            Capture.user_id == user.id,
            Capture.deleted_at == None
        ).order_by(
            "distance"
        ).limit(5).all()
    
    citations = []
    context_texts = []
    
    # 2.5 Fetch forcefully attached context (e.g. uploaded in chat box)
    if chat_req.attached_capture_ids:
        attached_captures = db.query(Capture).filter(
            Capture.id.in_(chat_req.attached_capture_ids),
            Capture.user_id == user.id
        ).all()
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
    
    # 3. Handle Conversation
    conversation_id = chat_req.conversation_id
    past_messages = []
    if not conversation_id:
        conversation = AIConversation(user_id=user.id, title=chat_req.message[:50])
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
            
    # 4. Construct prompt
    system_instruction = f"""You are YRecall, an AI Life Operating System for this user.
Use the following retrieved context from the user's past notes and memories to answer their query.
If the context doesn't contain the answer, you can still be helpful, but prioritize the user's context.
ALWAYS cite the memories if you use them.

--- RETRIEVED CONTEXT ---
{context_str}
"""
    
    # 5. Generate response with Gemini
    contents = past_messages
    user_prompt = chat_req.message if chat_req.message.strip() else "Please analyze the attached context."
    contents.append({"role": "user", "parts": [{"text": user_prompt}]})
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=genai.types.GenerateContentConfig(
            system_instruction=system_instruction
        )
    )
    assistant_reply = response.text
    
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
    
    return conversation, assistant_msg, citations
