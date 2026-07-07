import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import select, asc
from ...core.config import settings
from ...modules.users.models import User
from ..captures.models import Capture
from .models import AIConversation, AIMessage, AIEmbedding
from .schemas import ChatRequest

def chat_with_rag(db: Session, user: User, chat_req: ChatRequest) -> tuple[AIConversation, AIMessage]:
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured")
        
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    # 1. Embed user message
    embed_result = genai.embed_content(
        model="models/text-embedding-004",
        content=chat_req.message,
        task_type="retrieval_query"
    )
    user_query_embedding = embed_result['embedding']
    
    # 2. Retrieve top 5 most similar captures for this user
    # We join AIEmbedding with Capture to ensure we only get the user's captures
    # pgvector cosine distance operator is <=>
    results = db.query(Capture, AIEmbedding).join(
        AIEmbedding, Capture.id == AIEmbedding.capture_id
    ).filter(
        Capture.user_id == user.id,
        Capture.deleted_at == None
    ).order_by(
        AIEmbedding.embedding.cosine_distance(user_query_embedding)
    ).limit(5).all()
    
    # Construct context from retrieved captures
    context_texts = []
    for capture, _ in results:
        context_texts.append(f"- {capture.content_text}")
    
    context_str = "\n".join(context_texts) if context_texts else "No specific past context found."
    
    # 3. Construct prompt
    prompt = f"""You are YRecall, an AI Life Operating System.
Use the following retrieved context from the user's past notes and memories to answer their query.
If the context doesn't contain the answer, you can still be helpful, but prioritize the user's context.

--- RETRIEVED CONTEXT ---
{context_str}

--- USER QUERY ---
{chat_req.message}
"""
    
    # 4. Generate response with Gemini
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    assistant_reply = response.text
    
    # 5. Store conversation & messages
    conversation_id = chat_req.conversation_id
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
            
    user_msg = AIMessage(
        conversation_id=conversation_id,
        role="user",
        content=chat_req.message
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
    
    return conversation, assistant_msg
