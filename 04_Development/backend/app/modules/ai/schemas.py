from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str

class Citation(BaseModel):
    capture_id: UUID
    content: str
    similarity_score: float

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

class ChatResponse(BaseModel):
    conversation_id: UUID
    message: MessageResponse
    citations: List[Citation] = []

class ConversationResponse(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class ConversationListResponse(BaseModel):
    data: List[ConversationResponse]
