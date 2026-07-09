import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile, BackgroundTasks
from supabase import create_client, Client
from .models import Capture, CaptureNote, CaptureURL, CaptureLocation, CaptureMedia
from .schemas import CaptureCreateText, CaptureCreateNote, CaptureCreateURL, CaptureCreateLocation
from ...core.config import settings
from ...modules.users.models import User
from .tasks import (
    generate_and_store_embedding,
    process_url_capture,
    process_location_capture,
    process_media_capture
)

# Initialize Supabase client
supabase: Client = None
if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def create_text_capture(db: Session, user: User, capture_in: CaptureCreateText, background_tasks: BackgroundTasks) -> Capture:
    new_capture = Capture(
        user_id=user.id,
        type="text",
        title=capture_in.title,
        content_text=capture_in.content_text,
        status="completed"
    )
    db.add(new_capture)
    db.commit()
    db.refresh(new_capture)
    
    background_tasks.add_task(generate_and_store_embedding, db, new_capture.id, new_capture.content_text)
    return new_capture

def create_note_capture(db: Session, user: User, capture_in: CaptureCreateNote, background_tasks: BackgroundTasks) -> Capture:
    new_capture = Capture(
        user_id=user.id,
        type="note",
        title=capture_in.title,
        content_text=capture_in.content_text,
        status="completed"
    )
    db.add(new_capture)
    db.flush()
    
    note_meta = CaptureNote(
        capture_id=new_capture.id,
        rich_text=capture_in.rich_text,
        format=capture_in.format,
    )
    db.add(note_meta)
    db.commit()
    db.refresh(new_capture)
    
    background_tasks.add_task(generate_and_store_embedding, db, new_capture.id, new_capture.content_text)
    return new_capture

def create_url_capture(db: Session, user: User, capture_in: CaptureCreateURL, background_tasks: BackgroundTasks) -> Capture:
    new_capture = Capture(
        user_id=user.id,
        type="url",
        status="processing"
    )
    db.add(new_capture)
    db.flush()
    
    url_meta = CaptureURL(
        capture_id=new_capture.id,
        original_url=capture_in.url
    )
    db.add(url_meta)
    db.commit()
    db.refresh(new_capture)
    
    # Background task to fetch OG tags, markdown, and then embed
    background_tasks.add_task(process_url_capture, db, new_capture.id)
    return new_capture

def create_location_capture(db: Session, user: User, capture_in: CaptureCreateLocation, background_tasks: BackgroundTasks) -> Capture:
    new_capture = Capture(
        user_id=user.id,
        type="location",
        status="completed"
    )
    db.add(new_capture)
    db.flush()
    
    loc_meta = CaptureLocation(
        capture_id=new_capture.id,
        latitude=capture_in.latitude,
        longitude=capture_in.longitude,
        altitude=capture_in.altitude,
        accuracy=capture_in.accuracy
    )
    db.add(loc_meta)
    db.commit()
    db.refresh(new_capture)
    
    # Background task for reverse geocoding and embeddings
    background_tasks.add_task(process_location_capture, db, new_capture.id)
    return new_capture

def create_media_capture(db: Session, user: User, file: UploadFile, type_str: str, background_tasks: BackgroundTasks) -> Capture:
    if not supabase:
        raise ValueError("Supabase client not initialized")
        
    file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'bin'
    file_name = f"{user.id}/{uuid.uuid4()}.{file_ext}"
    
    file_bytes = file.file.read()
    res = supabase.storage.from_("captures").upload(file_name, file_bytes)
    public_url = supabase.storage.from_("captures").get_public_url(file_name)
    
    new_capture = Capture(
        user_id=user.id,
        type=type_str,
        file_url=public_url,
        storage_path=file_name,
        mime_type=file.content_type,
        file_size=len(file_bytes),
        status="processing"
    )
    db.add(new_capture)
    db.flush()
    
    media_meta = CaptureMedia(
        capture_id=new_capture.id
    )
    db.add(media_meta)
    db.commit()
    db.refresh(new_capture)
    
    # Background task for processing (OCR/Transcript/Summary/Embedding)
    background_tasks.add_task(process_media_capture, db, new_capture.id)
    return new_capture

def get_captures(db: Session, user: User, skip: int = 0, limit: int = 20):
    query = db.query(Capture).filter(Capture.user_id == user.id, Capture.deleted_at == None)
    total_items = query.count()
    captures = query.order_by(Capture.created_at.desc()).offset(skip).limit(limit).all()
    
    total_pages = (total_items + limit - 1) // limit if limit > 0 else 1
    page = (skip // limit) + 1 if limit > 0 else 1
    
    return {
        "meta": {
            "page": page,
            "page_size": limit,
            "total_pages": total_pages,
            "total_items": total_items
        },
        "data": captures
    }

def get_capture(db: Session, user: User, capture_id: uuid.UUID) -> Optional[Capture]:
    return db.query(Capture).filter(
        Capture.id == capture_id, 
        Capture.user_id == user.id, 
        Capture.deleted_at == None
    ).first()
