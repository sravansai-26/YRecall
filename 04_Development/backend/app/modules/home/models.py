import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, JSON, Date
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ...core.database import Base

class DailyBrief(Base):
    __tablename__ = "daily_briefs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    date = Column(Date, nullable=False, index=True)
    summary_text = Column(Text, nullable=False)
    
    # Store aggregated metrics to avoid recounting
    metrics = Column(JSONB, nullable=True) # e.g. {"captures_count": 27, "voice_notes": 4, "tasks": 3}
    
    # AI Priorities or recommended capture IDs
    priorities = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserInsight(Base):
    __tablename__ = "user_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    insight_text = Column(Text, nullable=False)
    insight_type = Column(String, nullable=False) # pattern, productivity, health, memory
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserStreak(Base):
    __tablename__ = "user_streaks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    streak_type = Column(String, nullable=False) # e.g., capture, reflect
    current_count = Column(Integer, default=0)
    highest_count = Column(Integer, default=0)
    last_active_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
