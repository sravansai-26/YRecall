from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from uuid import UUID
from datetime import datetime

class WidgetInstanceBase(BaseModel):
    widget_id: str
    instance_id: str
    config: Optional[Dict[str, Any]] = {}
    is_active: Optional[bool] = True

class WidgetInstanceCreate(WidgetInstanceBase):
    pass

class WidgetInstanceUpdate(BaseModel):
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class WidgetInstanceResponse(WidgetInstanceBase):
    id: UUID
    user_id: UUID
    last_refresh: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WidgetPreferenceBase(BaseModel):
    global_config: Optional[Dict[str, Any]] = {}

class WidgetPreferenceUpdate(WidgetPreferenceBase):
    pass

class WidgetPreferenceResponse(WidgetPreferenceBase):
    id: UUID
    user_id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
