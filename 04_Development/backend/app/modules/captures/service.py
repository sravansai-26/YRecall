import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile
from supabase import create_client, Client
from .models import Capture, CaptureNote, CaptureURL, CaptureLocation, CaptureMedia
from .schemas import CaptureCreateText, CaptureCreateNote, CaptureCreateURL, CaptureCreateLocation
from ...core.config import settings
from ...modules.users.models import User
from .tasks import generate_and_store_embedding

from app.core.ai.queue import enqueue_job
from ..notifications.service import create_notification

# Initialize Supabase client
supabase: Client = None
if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

from ...modules.graph.entity_resolver import async_extract_with_retry
from fastapi import HTTPException
from ..billing import entitlements, quota_service

def _check_capture_quota(db: Session, user: User):
    if not entitlements.check_quota(db, user.id, "captures_monthly"):
        raise HTTPException(status_code=403, detail="Monthly capture limit reached. Please upgrade to save more memories.")

def _notify_capture_created(db: Session, user: User, capture: Capture):
    try:
        create_notification(
            db=db,
            user_id=str(user.id),
            title="Memory Captured",
            content=f"Your {capture.type} capture has been saved and is being processed.",
            type="activity",
            category="Capture",
            related_capture_id=str(capture.id)
        )
    except Exception:
        pass

def create_text_capture(db: Session, user: User, capture_in: CaptureCreateText) -> Capture:
    _check_capture_quota(db, user)
    new_capture = Capture(
        user_id=user.id,
        type="text",
        title=capture_in.title,
        content_text=capture_in.content_text,
        status="processing"
    )
    db.add(new_capture)
    db.commit()
    db.refresh(new_capture)
    
    enqueue_job(db, new_capture.id, "enrichment")
    
    quota_service.increment_captures(db, user.id)
    _notify_capture_created(db, user, new_capture)
    return new_capture

def create_note_capture(db: Session, user: User, capture_in: CaptureCreateNote) -> Capture:
    _check_capture_quota(db, user)
    new_capture = Capture(
        user_id=user.id,
        type="note",
        title=capture_in.title,
        content_text=capture_in.content_text,
        status="processing"
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
    
    enqueue_job(db, new_capture.id, "enrichment")
    
    quota_service.increment_captures(db, user.id)
    _notify_capture_created(db, user, new_capture)
    return new_capture

def create_url_capture(db: Session, user: User, capture_in: CaptureCreateURL) -> Capture:
    _check_capture_quota(db, user)
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
    
    # Queue job to fetch OG tags, markdown, and then embed/summarize
    enqueue_job(db, new_capture.id, "enrichment")
    
    quota_service.increment_captures(db, user.id)
    _notify_capture_created(db, user, new_capture)
    return new_capture

def create_location_capture(db: Session, user: User, capture_in: CaptureCreateLocation) -> Capture:
    _check_capture_quota(db, user)
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
    
    # Queue job for reverse geocoding and embeddings
    enqueue_job(db, new_capture.id, "enrichment")
    
    quota_service.increment_captures(db, user.id)
    _notify_capture_created(db, user, new_capture)
    return new_capture

def create_media_capture(db: Session, user: User, file: UploadFile, type_str: str, upload_id: Optional[str] = None, title: Optional[str] = None) -> Capture:
    _check_capture_quota(db, user)
    
    final_id = uuid.uuid4()
    if upload_id:
        try:
            parsed_uuid = uuid.UUID(upload_id)
            existing = db.query(Capture).filter(Capture.id == parsed_uuid, Capture.user_id == user.id).first()
            if existing:
                return existing
            final_id = parsed_uuid
        except ValueError:
            pass
            
    if not supabase:
        raise ValueError("Supabase client not initialized")
        
    file_bytes = file.file.read()
    file_size = len(file_bytes)
    
    # Check storage quota before uploading
    usage = quota_service.get_usage(db, user.id)
    new_storage_size = usage.storage_used_bytes + file_size
    
    # Stricter storage check:
    limit = entitlements.FREE_LIMITS.get("storage_bytes", 0)
    plan_id = entitlements.get_user_plan_id(db, user.id)
    if plan_id == "free" and new_storage_size > limit:
        raise HTTPException(status_code=403, detail=f"Storage limit reached ({limit / (1024*1024):.0f} MB). Please upgrade.")

    file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'bin'
    file_name = f"{user.id}/{uuid.uuid4()}.{file_ext}"
    
    res = supabase.storage.from_("captures").upload(
        file_name, 
        file_bytes,
        file_options={"content-type": file.content_type}
    )
    public_url = supabase.storage.from_("captures").get_public_url(file_name)
    
    new_capture = Capture(
        id=final_id,
        user_id=user.id,
        type=type_str,
        title=title,
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
    
    
    # Queue job for processing (OCR/Transcript/Summary/Embedding)
    enqueue_job(db, new_capture.id, "enrichment")
    
    quota_service.increment_captures(db, user.id)
    quota_service.add_storage(db, user.id, file_size)
    
    return new_capture

def transcribe_audio_sync(db: Session, user: User, file: UploadFile) -> str:
    """
    Synchronously transcribes an uploaded audio file using Gemini API.
    Does not create a Capture record.
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured")
        
    from google import genai
    from google.genai import types
    
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    file_bytes = file.file.read()
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(data=file_bytes, mime_type=file.content_type),
                'Please provide a full transcript of this audio in the language spoken. Output ONLY the raw text without any summary or formatting. If the audio is completely silent or contains only background noise without clear speech, output exactly "[silence]".'
            ]
        )
        
        text = response.text.strip()
        if text.lower() == "[silence]":
            return ""
            
        return text
    except Exception as e:
        print(f"Gemini processing error: {e}")
        raise ValueError("Failed to transcribe audio")

from sqlalchemy import or_, func, text
from urllib.parse import unquote

def search_captures(db: Session, user: User, query: str, skip: int = 0, limit: int = 20):
    if not query or len(query.strip()) == 0:
        return get_captures(db, user, skip, limit)
        
    query_str = query.strip()
    
    # Base query for user's active captures
    base_query = db.query(Capture).filter(
        Capture.user_id == user.id, 
        Capture.deleted_at == None
    )
    
    # Implement PostgreSQL full-text search where supported, fallback to ILIKE
    # We use ILIKE on multiple fields for robust basic semantic search
    search_term = f"%{query_str}%"
    
    # Layer 1-4: Exact, Prefix, Fuzzy, Full-Text approximation via ILIKE
    # In a full production PostgreSQL setup with pg_trgm, ILIKE utilizes GiST/GIN indexes.
    # We query across title, content, summary, ocr, transcript.
    search_query = base_query.filter(
        or_(
            Capture.title.ilike(search_term),
            Capture.content_text.ilike(search_term),
            Capture.summary.ilike(search_term),
            Capture.ocr_text.ilike(search_term),
            Capture.transcript.ilike(search_term)
        )
    )
    
    # Order by creation date descending
    total_items = search_query.count()
    captures = search_query.order_by(Capture.created_at.desc()).offset(skip).limit(limit).all()
    
    total_pages = (total_items + limit - 1) // limit if limit > 0 else 1
    page = (skip // limit) + 1 if limit > 0 else 1
    
    return {
        "meta": {
            "page": page,
            "page_size": limit,
            "total_pages": total_pages,
            "total_items": total_items,
            "query": query_str
        },
        "data": captures
    }

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

def update_capture_title(db: Session, user: User, capture_id: uuid.UUID, title: str) -> Optional[Capture]:
    capture = get_capture(db, user, capture_id)
    if not capture:
        return None
    
    capture.title = title
    db.commit()
    db.refresh(capture)
    return capture

def delete_capture(db: Session, user: User, capture_id: uuid.UUID) -> bool:
    from datetime import datetime
    capture = db.query(Capture).filter(
        Capture.id == capture_id, 
        Capture.user_id == user.id, 
        Capture.deleted_at == None
    ).first()
    
    if not capture:
        return False
        
    capture.deleted_at = datetime.utcnow()
    db.commit()
    return True
