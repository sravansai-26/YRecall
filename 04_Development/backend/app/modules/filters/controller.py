from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from ...core.database import get_db
from ...core.security import get_current_user
from ..users.models import User
from .schemas import MemoryFilterSettingsUpdate, MemoryFilterSettingsResponse, MemoryFilterStatsResponse
from .models import MemoryFilterSettings

router = APIRouter()

@router.get("/settings", response_model=MemoryFilterSettingsResponse)
def get_filter_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(MemoryFilterSettings).filter(MemoryFilterSettings.user_id == current_user.id).first()
    if not settings:
        settings = MemoryFilterSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=MemoryFilterSettingsResponse)
def update_filter_settings(
    data: MemoryFilterSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(MemoryFilterSettings).filter(MemoryFilterSettings.user_id == current_user.id).first()
    if not settings:
        settings = MemoryFilterSettings(user_id=current_user.id)
        db.add(settings)
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/stats", response_model=MemoryFilterStatsResponse)
def get_filter_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Dummy mock data, normally would query timeline/captures table
    return {
        "total_memories": 1042,
        "visible_memories": 890,
        "hidden_memories": 152,
        "archived_memories": 150,
        "pinned_memories": 12,
        "favourite_memories": 45,
        "recently_added": 8,
        "recently_accessed": 24,
        "recently_modified": 5
    }
