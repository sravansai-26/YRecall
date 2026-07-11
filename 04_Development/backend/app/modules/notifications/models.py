import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ...core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String, nullable=False, index=True) # reminder, suggestion, system, insight, graph_discovery, duplicate, activity
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
