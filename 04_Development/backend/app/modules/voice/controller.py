from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from ...core.database import get_db
from ...core.security import get_current_user
from ..users.models import User
from .schemas import VoiceSettingsUpdate, VoiceSettingsResponse, VoiceStatsResponse
from .models import VoiceSettings

router = APIRouter()

@router.get("/settings", response_model=VoiceSettingsResponse)
def get_voice_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(VoiceSettings).filter(VoiceSettings.user_id == current_user.id).first()
    if not settings:
        settings = VoiceSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=VoiceSettingsResponse)
def update_voice_settings(
    data: VoiceSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(VoiceSettings).filter(VoiceSettings.user_id == current_user.id).first()
    if not settings:
        settings = VoiceSettings(user_id=current_user.id)
        db.add(settings)
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/stats", response_model=VoiceStatsResponse)
def get_voice_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Dummy mock data for now, ideally read from actual files/stats
    return {
        "voice_memories_count": 42,
        "average_accuracy": 94.5,
        "storage_used_bytes": 1024 * 1024 * 150, # 150MB
        "average_processing_time_ms": 1200,
        "audio_files_count": 42,
        "transcripts_count": 42,
        "temp_files_bytes": 0
    }
