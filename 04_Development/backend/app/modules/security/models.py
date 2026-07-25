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
