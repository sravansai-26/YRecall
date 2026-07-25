import uuid
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from ...core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    display_name = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    fcm_token = Column(String, nullable=True)
    
    # Extended Profile Fields
    username = Column(String, unique=True, index=True, nullable=True)
    bio = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    language = Column(String, nullable=True)
    country = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    website = Column(String, nullable=True)
    social_links = Column(JSONB, nullable=True, server_default='{}')
    birthday = Column(DateTime(timezone=True), nullable=True)
    
    # Activity & Streaks
    last_login = Column(DateTime(timezone=True), nullable=True)
    last_sync = Column(DateTime(timezone=True), nullable=True)
    current_streak = Column(Integer, default=0, server_default='0')
    
    notification_preferences = Column(
        JSONB, 
        nullable=False, 
        server_default='{"reminders": true, "insights": true, "relationships": true, "system": true}'
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
