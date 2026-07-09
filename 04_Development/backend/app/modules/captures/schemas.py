from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class CaptureEntityBase(BaseModel):
    entity_type: str
    entity_value: str
    confidence: Optional[float] = None

class CaptureEntityResponse(CaptureEntityBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

class CaptureNoteBase(BaseModel):
    rich_text: Optional[Any] = None
    format: str = "markdown"
    is_pinned: int = 0

class CaptureNoteResponse(CaptureNoteBase):
    model_config = ConfigDict(from_attributes=True)

class CaptureMediaBase(BaseModel):
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None
    orientation: Optional[str] = None
    exif_data: Optional[Any] = None

class CaptureMediaResponse(CaptureMediaBase):
    model_config = ConfigDict(from_attributes=True)

class CaptureURLBase(BaseModel):
    original_url: str
    domain: Optional[str] = None
    author: Optional[str] = None
    publish_date: Optional[datetime] = None
    reading_time: Optional[int] = None
    og_image: Optional[str] = None

class CaptureURLResponse(CaptureURLBase):
    model_config = ConfigDict(from_attributes=True)

class CaptureLocationBase(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    accuracy: Optional[float] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    nearby_places: Optional[Any] = None

class CaptureLocationResponse(CaptureLocationBase):
    model_config = ConfigDict(from_attributes=True)

class CaptureResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    status: str
    title: Optional[str] = None
    content_text: Optional[str] = None
    summary: Optional[str] = None
    ocr_text: Optional[str] = None
    transcript: Optional[str] = None
    storage_path: Optional[str] = None
    thumbnail_path: Optional[str] = None
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    file_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Metadata relationships
    note_metadata: Optional[CaptureNoteResponse] = None
    media_metadata: Optional[CaptureMediaResponse] = None
    url_metadata: Optional[CaptureURLResponse] = None
    location_metadata: Optional[CaptureLocationResponse] = None
    entities: List[CaptureEntityResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class PaginatedCaptures(BaseModel):
    meta: dict
    data: List[CaptureResponse]

class CaptureCreateText(BaseModel):
    content_text: str
    title: Optional[str] = None

class CaptureCreateNote(BaseModel):
    rich_text: Any
    format: str = "markdown"
    content_text: str # For searchability
    title: Optional[str] = None

class CaptureCreateURL(BaseModel):
    url: str

class CaptureCreateLocation(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    accuracy: Optional[float] = None
