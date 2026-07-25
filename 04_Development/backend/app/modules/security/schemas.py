from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# Security Settings
class SecuritySettingsBase(BaseModel):
    biometric_enabled: bool = False
    app_lock_timeout: int = -1
    require_for_opening: bool = False
    require_for_settings: bool = True
    require_for_exports: bool = True
    require_for_deleting: bool = True
    require_for_sensitive: bool = True
    protected_categories: List[str] = Field(default_factory=list)
    hide_app_preview: bool = True
    hide_memory_content: bool = False

class SecuritySettingsCreate(SecuritySettingsBase):
    pass

class SecuritySettingsUpdate(BaseModel):
    biometric_enabled: Optional[bool] = None
    app_lock_timeout: Optional[int] = None
    require_for_opening: Optional[bool] = None
    require_for_settings: Optional[bool] = None
    require_for_exports: Optional[bool] = None
    require_for_deleting: Optional[bool] = None
    require_for_sensitive: Optional[bool] = None
    protected_categories: Optional[List[str]] = None
    hide_app_preview: Optional[bool] = None
    hide_memory_content: Optional[bool] = None

class SecuritySettingsResponse(SecuritySettingsBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Device Session
class DeviceSessionBase(BaseModel):
    device_id: str
    device_name: Optional[str] = None
    platform: Optional[str] = None
    location: Optional[str] = None
    is_trusted: bool = False

class DeviceSessionCreate(DeviceSessionBase):
    pass

class DeviceSessionUpdate(BaseModel):
    device_name: Optional[str] = None
    is_trusted: Optional[bool] = None

class DeviceSessionResponse(DeviceSessionBase):
    id: UUID
    user_id: UUID
    started_at: datetime
    last_active_at: datetime
    revoked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Security Audit Log
class SecurityAuditLogBase(BaseModel):
    event_type: str
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class SecurityAuditLogResponse(SecurityAuditLogBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
