import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, func
from datetime import datetime, timedelta, timezone

from ...modules.users.models import User
from ...modules.captures.models import Capture, CaptureNote, CaptureMedia, CaptureURL, CaptureLocation

def get_timeline(
    db: Session, 
    user: User, 
    skip: int = 0, 
    limit: int = 20,
    type_filter: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search_query: Optional[str] = None,
    workspace_id: Optional[uuid.UUID] = None
) -> dict:
    
    query = db.query(Capture).filter(
        Capture.deleted_at == None
    )
    
    if workspace_id:
        from ..collaboration.models import SharedCapture
        query = query.join(SharedCapture, SharedCapture.capture_id == Capture.id).filter(
            SharedCapture.workspace_id == workspace_id
        )
    else:
        query = query.filter(Capture.user_id == user.id)
    
    if type_filter:
        query = query.filter(Capture.type == type_filter)
        
    if start_date:
        query = query.filter(Capture.created_at >= start_date)
        
    if end_date:
        query = query.filter(Capture.created_at <= end_date)
        
    if search_query:
        search_term = f"%{search_query}%"
        query = query.filter(
            or_(
                Capture.title.ilike(search_term),
                Capture.content_text.ilike(search_term),
                Capture.ocr_text.ilike(search_term),
                Capture.transcript.ilike(search_term),
                Capture.summary.ilike(search_term)
            )
        )
        
    total_items = query.count()
    from sqlalchemy.orm import selectinload
    captures = query.options(
        selectinload(Capture.note_metadata),
        selectinload(Capture.media_metadata),
        selectinload(Capture.url_metadata),
        selectinload(Capture.location_metadata),
        selectinload(Capture.entities)
    ).order_by(desc(Capture.created_at)).offset(skip).limit(limit).all()
    
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

def get_related_memories(db: Session, user: User, capture_id: uuid.UUID, limit: int = 5) -> dict:
    # Basic related logic: same date or same type, excluding itself
    # In a real app this would use vector search / pgvector or entity matching
    base_capture = db.query(Capture).filter(Capture.id == capture_id, Capture.user_id == user.id).first()
    if not base_capture:
        return {"meta": {"page": 1, "page_size": limit, "total_pages": 0, "total_items": 0}, "data": []}
    
    start_of_day = base_capture.created_at.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)
    
    # Try to find captures on the same day OR same type
    query = db.query(Capture).filter(
        Capture.user_id == user.id,
        Capture.id != capture_id,
        Capture.deleted_at == None,
        or_(
            and_(Capture.created_at >= start_of_day, Capture.created_at < end_of_day),
            Capture.type == base_capture.type
        )
    )
    
    from sqlalchemy.orm import selectinload
    captures = query.options(
        selectinload(Capture.note_metadata),
        selectinload(Capture.media_metadata),
        selectinload(Capture.url_metadata),
        selectinload(Capture.location_metadata),
        selectinload(Capture.entities)
    ).order_by(desc(Capture.created_at)).limit(limit).all()
    
    return {
        "meta": {
            "page": 1,
            "page_size": limit,
            "total_pages": 1 if captures else 0,
            "total_items": len(captures)
        },
        "data": captures
    }

def get_timeline_stats(db: Session, user: User) -> dict:
    total = db.query(Capture).filter(Capture.user_id == user.id, Capture.deleted_at == None).count()
    
    type_counts_raw = db.query(Capture.type, func.count(Capture.id)).filter(
        Capture.user_id == user.id, 
        Capture.deleted_at == None
    ).group_by(Capture.type).all()
    
    type_counts = {t: c for t, c in type_counts_raw}
    
    return {
        "total_memories": total,
        "by_type": type_counts
    }
