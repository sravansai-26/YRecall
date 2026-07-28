from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Boolean
from app.core.database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone

class WidgetInstance(Base):
    __tablename__ = "widget_instances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    widget_id = Column(String(50), nullable=False) # e.g., 'quick_capture', 'daily_brief'
    instance_id = Column(String(100), nullable=False, unique=True) # Android widgetId or specific instance marker
    config = Column(JSON, nullable=False, default={})
    is_active = Column(Boolean, default=True)
    last_refresh = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class WidgetPreference(Base):
    __tablename__ = "widget_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    global_config = Column(JSON, nullable=False, default={})
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
