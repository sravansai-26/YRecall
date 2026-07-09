import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ...core.database import Base

class Capture(Base):
    __tablename__ = "captures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String, nullable=False, index=True) # text, note, image, voice, audio, video, pdf, document, url, clipboard, screenshot, location, file
    status = Column(String, default="completed", index=True) # processing, completed, failed
    
    title = Column(String, nullable=True)
    content_text = Column(Text, nullable=True) # extracted or raw text
    summary = Column(Text, nullable=True) # AI summary
    ocr_text = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    
    storage_path = Column(String, nullable=True)
    thumbnail_path = Column(String, nullable=True)
    mime_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    file_url = Column(String, nullable=True) # For backward compatibility
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    note_metadata = relationship("CaptureNote", back_populates="capture", uselist=False, cascade="all, delete-orphan")
    media_metadata = relationship("CaptureMedia", back_populates="capture", uselist=False, cascade="all, delete-orphan")
    url_metadata = relationship("CaptureURL", back_populates="capture", uselist=False, cascade="all, delete-orphan")
    location_metadata = relationship("CaptureLocation", back_populates="capture", uselist=False, cascade="all, delete-orphan")
    entities = relationship("CaptureEntity", back_populates="capture", cascade="all, delete-orphan")


class CaptureNote(Base):
    __tablename__ = "capture_notes"
    
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), primary_key=True)
    rich_text = Column(JSONB, nullable=True) # EditorJS, ProseMirror, or markdown AST
    format = Column(String, default="markdown")
    is_pinned = Column(Integer, default=0)
    
    capture = relationship("Capture", back_populates="note_metadata")


class CaptureMedia(Base):
    __tablename__ = "capture_media"
    
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), primary_key=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    duration = Column(Float, nullable=True) # in seconds for audio/video
    orientation = Column(String, nullable=True)
    exif_data = Column(JSONB, nullable=True)
    
    capture = relationship("Capture", back_populates="media_metadata")


class CaptureURL(Base):
    __tablename__ = "capture_urls"
    
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), primary_key=True)
    original_url = Column(String, nullable=False)
    domain = Column(String, nullable=True)
    author = Column(String, nullable=True)
    publish_date = Column(DateTime(timezone=True), nullable=True)
    reading_time = Column(Integer, nullable=True) # minutes
    og_image = Column(String, nullable=True)
    
    capture = relationship("Capture", back_populates="url_metadata")


class CaptureLocation(Base):
    __tablename__ = "capture_locations"
    
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), primary_key=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    nearby_places = Column(JSONB, nullable=True)
    
    capture = relationship("Capture", back_populates="location_metadata")


class CaptureEntity(Base):
    __tablename__ = "capture_entities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type = Column(String, nullable=False) # e.g. person, organization, location, concept
    entity_value = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)
    
    capture = relationship("Capture", back_populates="entities")
