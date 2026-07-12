from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class ReminderBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None

class ReminderCreate(ReminderBase):
    source_capture_id: Optional[UUID] = None

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None

class ReminderResponse(ReminderBase):
    id: UUID
    user_id: UUID
    status: str
    source_capture_id: Optional[UUID] = None
    created_by_automation: bool
    confidence_score: Optional[float] = None
    ai_reasoning: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AutomationSuggestionResponse(BaseModel):
    id: UUID
    user_id: UUID
    source_capture_id: Optional[UUID]
    suggestion_type: str
    proposed_configuration: Dict[str, Any]
    reasoning: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
