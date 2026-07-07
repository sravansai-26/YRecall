import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile, BackgroundTasks
from supabase import create_client, Client
from .models import Capture
from .schemas import CaptureCreateText
from .tasks import generate_and_store_embedding
from ...core.config import settings
from ...modules.users.models import User

# Initialize Supabase client
supabase: Client = None
if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def create_text_capture(db: Session, user: User, capture_in: CaptureCreateText, background_tasks: BackgroundTasks) -> Capture:
    new_capture = Capture(
        user_id=user.id,
        type="text",
        content_text=capture_in.content_text
    )
    db.add(new_capture)
    db.commit()
    db.refresh(new_capture)
    
    # Trigger background task for embedding
    background_tasks.add_task(generate_and_store_embedding, db, new_capture.id, new_capture.content_text)
    
    return new_capture

def create_voice_capture(db: Session, user: User, file: UploadFile, background_tasks: BackgroundTasks) -> Capture:
    if not supabase:
        raise ValueError("Supabase client not initialized")
        
    file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'mp3'
    file_name = f"{user.id}/{uuid.uuid4()}.{file_ext}"
    
    # Upload to Supabase Storage
    file_bytes = file.file.read()
    res = supabase.storage.from_("captures").upload(file_name, file_bytes)
    
    # Get public URL
    public_url = supabase.storage.from_("captures").get_public_url(file_name)
    
    new_capture = Capture(
        user_id=user.id,
        type="voice",
        file_url=public_url,
        content_text=f"Voice note ({file.filename})" # Placeholder until transcription is implemented
    )
    db.add(new_capture)
    db.commit()
    db.refresh(new_capture)
    
    # Trigger embedding on the placeholder text (or transcription later)
    background_tasks.add_task(generate_and_store_embedding, db, new_capture.id, new_capture.content_text)
    
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
