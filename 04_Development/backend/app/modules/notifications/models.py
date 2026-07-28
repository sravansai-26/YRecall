import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ...core.database import Base
from ...modules.captures.models import Capture, CaptureEntity

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String, nullable=False, index=True) # reminder, suggestion, system, insight, graph_discovery, duplicate, activity
    category = Column(String, default="System", index=True) # Account, Capture, Security, etc.
    status = Column(String, default="delivered") # delivered, opened, dismissed, expired, failed
    title = Column(String, nullable=False)
    content = Column(String, nullable=True)
    
    is_read = Column(Boolean, default=False, index=True)
    is_archived = Column(Boolean, default=False, index=True)
    is_critical = Column(Boolean, default=False)
    
    # Optional relation to timeline capture, graph entity, or project
    related_capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="SET NULL"), nullable=True)
    related_entity_id = Column(UUID(as_uuid=True), ForeignKey("capture_entities.id", ondelete="SET NULL"), nullable=True)
    
    action_type = Column(String, nullable=True) # open_capture, open_graph, prompt_merge, open_chat
    action_data = Column(JSONB, nullable=True) # Any extra payload
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    capture = relationship("Capture", foreign_keys=[related_capture_id])
    entity = relationship("CaptureEntity", foreign_keys=[related_entity_id])

class NotificationSettings(Base):
    __tablename__ = "notification_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    categories = Column(JSONB, nullable=False, server_default='{}')
    quiet_hours_enabled = Column(Boolean, default=False)
    quiet_hours_start = Column(String, default="22:00")
    quiet_hours_end = Column(String, default="07:00")
    focus_mode_sync = Column(Boolean, default=False)
    weekend_rules_enabled = Column(Boolean, default=False)
    vacation_mode = Column(Boolean, default=False)
    
    delivery_channels = Column(JSONB, nullable=False, server_default='{"push": true, "in_app": true, "daily_digest": false}')
    frequency = Column(String, default="immediate") # immediate, batched, daily
    
    smart_suggestions = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    user = relationship("User")
