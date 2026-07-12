from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str
    attached_capture_ids: List[UUID] = []
    workspace_id: Optional[UUID] = None
    stream: bool = False

class Citation(BaseModel):
    capture_id: UUID
    content: str
    similarity_score: float

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    status: str
    attachments: Optional[List[UUID]] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class ChatResponse(BaseModel):
    conversation_id: UUID
    message: MessageResponse
    citations: List[Citation] = []

class ConversationResponse(BaseModel):
    id: UUID
    title: Optional[str]
    is_pinned: bool
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class ConversationListResponse(BaseModel):
    data: List[ConversationResponse]
