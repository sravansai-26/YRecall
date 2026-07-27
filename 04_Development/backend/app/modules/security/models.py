import uuid
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ...core.database import Base

class SecuritySettings(Base):
    __tablename__ = "security_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Biometrics & Lock
    biometric_enabled = Column(Boolean, default=False)
    app_lock_timeout = Column(Integer, default=-1) # -1 = never, 0 = immediate, >0 = seconds
    
    # Require Auth Actions
    require_for_opening = Column(Boolean, default=False)
    require_for_settings = Column(Boolean, default=True)
    require_for_exports = Column(Boolean, default=True)
    require_for_deleting = Column(Boolean, default=True)
    require_for_sensitive = Column(Boolean, default=True)
    
    # Protected Content
    protected_categories = Column(JSONB, server_default='["financial", "private_collections", "passwords"]')
    
    # Privacy
    hide_app_preview = Column(Boolean, default=True)
    hide_memory_content = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")

class DeviceSession(Base):
    __tablename__ = "device_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_id = Column(String, index=True, nullable=False)
    device_name = Column(String, nullable=True)
    platform = Column(String, nullable=True) # iOS, Android, Web
    location = Column(String, nullable=True)
    is_trusted = Column(Boolean, default=False)
    
    session_token = Column(String, unique=True, index=True, nullable=False)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    revoked_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")

class SecurityAuditLog(Base):
    __tablename__ = "security_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String, index=True, nullable=False) # e.g., login_success, login_failed, biometric_failure, settings_changed
    device_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    details = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

class EncryptionSettings(Base):
    __tablename__ = "encryption_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Local Device Protection
    secure_local_storage = Column(Boolean, default=True)
    encrypted_cache = Column(Boolean, default=True)
    encrypted_temp_files = Column(Boolean, default=True)
    offline_encryption = Column(Boolean, default=True)
    local_db_protection = Column(Boolean, default=True)
    secure_file_storage = Column(Boolean, default=True)
    auto_cache_cleanup = Column(Boolean, default=True)

    # Cloud Protection
    encrypted_uploads = Column(Boolean, default=True)
    protected_cloud_storage = Column(Boolean, default=True)
    encrypted_metadata = Column(Boolean, default=False)
    protected_sync = Column(Boolean, default=True)
    secure_api = Column(Boolean, default=True)

    # Sensitive Data Protection
    enhanced_protection_categories = Column(JSONB, server_default='["financial", "identity", "medical", "passwords", "voice"]')

    # Encryption Policies
    default_protection_level = Column(String, default="standard") # standard, high, maximum
    sensitive_data_policy = Column(String, default="strict") # strict, relaxed
    export_protection = Column(Boolean, default=True)
    sharing_protection = Column(Boolean, default=True)
    temp_file_lifetime_hours = Column(Integer, default=24)
    
    # Secure Sharing
    encrypted_sharing = Column(Boolean, default=True)
    workspace_encryption = Column(Boolean, default=False)
    protected_shared_links = Column(Boolean, default=True)
    share_expiration_days = Column(Integer, default=7)
    access_restrictions = Column(Boolean, default=True)
    
    # Secure Backups
    encrypted_backup = Column(Boolean, default=True)
    backup_verification = Column(Boolean, default=True)
    auto_backup_validation = Column(Boolean, default=True)
    backup_integrity_checks = Column(Boolean, default=True)
    restore_verification = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
