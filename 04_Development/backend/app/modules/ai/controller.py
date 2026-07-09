from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List
from uuid import UUID
from .schemas import ChatRequest, ChatResponse, ConversationListResponse, ConversationResponse, MessageResponse
from . import service
from .models import AIConversation, AIMessage
from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

router = APIRouter()

@router.get("/conversations", response_model=dict)
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        conversations = db.query(AIConversation).filter(AIConversation.user_id == current_user.id).order_by(desc(AIConversation.updated_at)).all()
        return {
            "success": True,
            "message": "Conversations retrieved.",
            "data": [
                {
                    "id": str(c.id),
                    "title": c.title,
                    "created_at": c.created_at.isoformat(),
                    "updated_at": c.updated_at.isoformat()
                } for c in conversations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/conversations/{conversation_id}/messages", response_model=dict)
def get_messages(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        conversation = db.query(AIConversation).filter(AIConversation.id == conversation_id, AIConversation.user_id == current_user.id).first()
        if not conversation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
            
        messages = db.query(AIMessage).filter(AIMessage.conversation_id == conversation_id).order_by(asc(AIMessage.created_at)).all()
        return {
            "success": True,
            "message": "Messages retrieved.",
            "data": [
                {
                    "id": str(m.id),
                    "role": m.role,
                    "content": m.content,
                    "created_at": m.created_at.isoformat()
                } for m in messages
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/chat", response_model=dict)
def chat_endpoint(
    chat_req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        conversation, message, citations = service.chat_with_rag(db, current_user, chat_req)
        
        # Also update conversation timestamp
        conversation.updated_at = message.created_at
        db.commit()
        
        return {
            "success": True,
            "message": "AI Response generated.",
            "data": {
                "conversation_id": str(conversation.id),
                "message": {
                    "id": str(message.id),
                    "role": message.role,
                    "content": message.content,
                    "created_at": message.created_at.isoformat()
                },
                "citations": [
                    {
                        "capture_id": str(c.capture_id),
                        "content": c.content,
                        "similarity_score": c.similarity_score
                    } for c in citations
                ]
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
