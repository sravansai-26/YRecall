import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ...core.database import Base

class UserPersona(Base):
    __tablename__ = "user_personas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    communication_style = Column(String, nullable=True)
    thinking_style = Column(String, nullable=True)
    productivity_style = Column(String, nullable=True)
    personality = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    interests = Column(JSONB, nullable=True) # list of strings
    preferred_language = Column(String, nullable=True)
    preferred_ai_tone = Column(String, nullable=True)
    notification_preference = Column(String, nullable=True)
    work_schedule = Column(String, nullable=True)
    sleep_schedule = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    memory_goals = Column(String, nullable=True)
    long_term_goals = Column(String, nullable=True)
    preferred_summary_size = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserGoal(Base):
    __tablename__ = "user_goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String, nullable=False)
    category = Column(String, nullable=True) # Career, Fitness, Learning, etc.
    description = Column(String, nullable=True)
    target_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="active") # active, completed, abandoned

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    theme = Column(String, default="system")
    language = Column(String, default="en")
    units = Column(String, default="metric")
    calendar = Column(String, default="gregorian")
    privacy = Column(String, default="standard")
    ai_verbosity = Column(String, default="balanced")
    response_style = Column(String, default="conversational")
    emoji_preference = Column(String, default="enabled")
    markdown_preference = Column(String, default="enabled")
    voice_preference = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserBehavior(Base):
    __tablename__ = "user_behaviors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Store aggregated behavioral data: 
    # e.g., {"preferred_capture_type": "text", "peak_activity_hour": 21}
    data = Column(JSONB, nullable=False, server_default='{}')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
