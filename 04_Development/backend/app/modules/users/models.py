import uuid
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
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

class ExperienceSettings(Base):
    __tablename__ = "experience_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Appearance & Theme
    theme = Column(String, default="system") # light, dark, system
    accent_color = Column(String, default="default")
    
    # Typography
    font_size = Column(String, default="medium") # small, medium, large, x-large
    display_density = Column(String, default="comfortable") # compact, comfortable, spacious
    
    # Localization & Language
    language = Column(String, default="en") # en, hi, te, ta, kn, ml, bn, mr, gu, pa, or, as, ur, es, fr, de, it, pt, ru, ar, tr, ja, ko, zh-CN, zh-TW, id, ms, vi, th, pl, nl
    
    # Reading Experience
    reading_mode = Column(Boolean, default=False)
    
    # Motion & Animation
    reduce_motion = Column(Boolean, default=False)
    
    # Accessibility
    high_contrast = Column(Boolean, default=False)
    color_blind_friendly = Column(Boolean, default=False)
    screen_reader_optimization = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
