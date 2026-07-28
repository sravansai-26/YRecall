from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class NotificationResponse(BaseModel):
    id: UUID
    type: str
    category: str
    status: str
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
    categories: Optional[Dict[str, Any]] = None
    quiet_hours_enabled: Optional[bool] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    focus_mode_sync: Optional[bool] = None
    weekend_rules_enabled: Optional[bool] = None
    vacation_mode: Optional[bool] = None
    delivery_channels: Optional[Dict[str, bool]] = None
    frequency: Optional[str] = None
    smart_suggestions: Optional[bool] = None

class NotificationSettingsResponse(BaseModel):
    categories: Dict[str, Any]
    quiet_hours_enabled: bool
    quiet_hours_start: str
    quiet_hours_end: str
    focus_mode_sync: bool
    weekend_rules_enabled: bool
    vacation_mode: bool
    delivery_channels: Dict[str, bool]
    frequency: str
    smart_suggestions: bool
    
    model_config = ConfigDict(from_attributes=True)
