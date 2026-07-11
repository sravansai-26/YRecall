from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class NotificationResponse(BaseModel):
    id: UUID
    type: str
    title: str
    content: Optional[str] = None
    is_read: bool
    is_archived: bool
    is_critical: bool
    related_capture_id: Optional[UUID] = None
    related_entity_id: Optional[UUID] = None
    action_type: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class FCMTokenUpdate(BaseModel):
    fcm_token: str

class NotificationSettingsUpdate(BaseModel):
    reminders: bool
    insights: bool
    relationships: bool
    system: bool
