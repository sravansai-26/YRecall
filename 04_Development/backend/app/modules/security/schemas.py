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

# Encryption Settings
class EncryptionSettingsBase(BaseModel):
    secure_local_storage: bool = True
    encrypted_cache: bool = True
    encrypted_temp_files: bool = True
    offline_encryption: bool = True
    local_db_protection: bool = True
    secure_file_storage: bool = True
    auto_cache_cleanup: bool = True

    encrypted_uploads: bool = True
    protected_cloud_storage: bool = True
    encrypted_metadata: bool = False
    protected_sync: bool = True
    secure_api: bool = True

    enhanced_protection_categories: List[str] = Field(default_factory=lambda: ["financial", "identity", "medical", "passwords", "voice"])

    default_protection_level: str = "standard"
    sensitive_data_policy: str = "strict"
    export_protection: bool = True
    sharing_protection: bool = True
    temp_file_lifetime_hours: int = 24
    
    encrypted_sharing: bool = True
    workspace_encryption: bool = False
    protected_shared_links: bool = True
    share_expiration_days: int = 7
    access_restrictions: bool = True
    
    encrypted_backup: bool = True
    backup_verification: bool = True
    auto_backup_validation: bool = True
    backup_integrity_checks: bool = True
    restore_verification: bool = True

class EncryptionSettingsCreate(EncryptionSettingsBase):
    pass

class EncryptionSettingsUpdate(BaseModel):
    secure_local_storage: Optional[bool] = None
    encrypted_cache: Optional[bool] = None
    encrypted_temp_files: Optional[bool] = None
    offline_encryption: Optional[bool] = None
    local_db_protection: Optional[bool] = None
    secure_file_storage: Optional[bool] = None
    auto_cache_cleanup: Optional[bool] = None

    encrypted_uploads: Optional[bool] = None
    protected_cloud_storage: Optional[bool] = None
    encrypted_metadata: Optional[bool] = None
    protected_sync: Optional[bool] = None
    secure_api: Optional[bool] = None

    enhanced_protection_categories: Optional[List[str]] = None

    default_protection_level: Optional[str] = None
    sensitive_data_policy: Optional[str] = None
    export_protection: Optional[bool] = None
    sharing_protection: Optional[bool] = None
    temp_file_lifetime_hours: Optional[int] = None
    
    encrypted_sharing: Optional[bool] = None
    workspace_encryption: Optional[bool] = None
    protected_shared_links: Optional[bool] = None
    share_expiration_days: Optional[int] = None
    access_restrictions: Optional[bool] = None
    
    encrypted_backup: Optional[bool] = None
    backup_verification: Optional[bool] = None
    auto_backup_validation: Optional[bool] = None
    backup_integrity_checks: Optional[bool] = None
    restore_verification: Optional[bool] = None

class EncryptionSettingsResponse(EncryptionSettingsBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
