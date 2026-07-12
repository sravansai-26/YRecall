from fastapi import APIRouter, Depends, Query, HTTPException, status
from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User
from .schemas import TimelineResponse
from . import service

router = APIRouter()

@router.get("", response_model=TimelineResponse)
def get_timeline(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    workspace_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import uuid
    ws_uuid = None
    if workspace_id:
        try:
            ws_uuid = uuid.UUID(workspace_id)
            from ..collaboration.permissions import require_role, WorkspaceRole
            require_role(db, ws_uuid, current_user, WorkspaceRole.VIEWER)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    result = service.get_timeline(
        db, current_user, skip=skip, limit=limit, 
        type_filter=type, search_query=search,
        start_date=start_date, end_date=end_date,
        workspace_id=ws_uuid
    )
    return {
        "success": True,
        "message": "Timeline retrieved successfully",
        "data": result["data"],
        "meta": result["meta"]
    }

@router.get("/{id}/related", response_model=TimelineResponse)
def get_related_memories(
    id: str,
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import uuid
    try:
        capture_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid capture ID format")
        
    result = service.get_related_memories(db, current_user, capture_uuid, limit)
    return {
        "success": True,
        "message": "Related memories retrieved successfully",
        "data": result["data"],
        "meta": result["meta"]
    }

@router.get("/today", response_model=TimelineResponse)
def get_timeline_today(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = service.get_timeline(
        db, current_user, skip=skip, limit=limit, 
        start_date=start_of_day
    )
    return {
        "success": True,
        "message": "Today's timeline retrieved successfully",
        "data": result["data"],
        "meta": result["meta"]
    }

@router.get("/week", response_model=TimelineResponse)
def get_timeline_week(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    start_of_week = (now - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = service.get_timeline(
        db, current_user, skip=skip, limit=limit, 
        start_date=start_of_week
    )
    return {
        "success": True,
        "message": "This week's timeline retrieved successfully",
        "data": result["data"],
        "meta": result["meta"]
    }

@router.get("/month", response_model=TimelineResponse)
def get_timeline_month(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    start_of_month = (now - timedelta(days=30)).replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = service.get_timeline(
        db, current_user, skip=skip, limit=limit, 
        start_date=start_of_month
    )
    return {
        "success": True,
        "message": "This month's timeline retrieved successfully",
        "data": result["data"],
        "meta": result["meta"]
    }

@router.get("/stats", response_model=dict)
def get_timeline_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stats = service.get_timeline_stats(db, current_user)
    return {
        "success": True,
        "message": "Stats retrieved successfully",
        "data": stats
    }
