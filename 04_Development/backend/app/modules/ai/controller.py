from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .schemas import ChatRequest, ChatResponse
from . import service
from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

router = APIRouter()

@router.post("/chat", response_model=dict)
def chat_endpoint(
    chat_req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        conversation, message = service.chat_with_rag(db, current_user, chat_req)
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
                }
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
