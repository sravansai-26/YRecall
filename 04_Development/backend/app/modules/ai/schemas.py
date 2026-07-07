from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

class ChatResponse(BaseModel):
    conversation_id: UUID
    message: MessageResponse
