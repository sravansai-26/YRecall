from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ...core.database import get_db
from ...core.security import get_current_user
from .models import User
from .schemas import UserResponse, UserUpdate
from typing import Any, Dict
from datetime import datetime, timezone

try:
    from ..captures.models import Capture
except ImportError:
    Capture = None

try:
    from ..collaboration.models import Workspace
except ImportError:
    Workspace = None

try:
    from ..persona.models import Persona
except ImportError:
    Persona = None

router = APIRouter(tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the current user's profile."""
    update_data = user_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    db.commit()
    db.refresh(current_user)
    
    # Trigger Notification
    try:
        from ..notifications.service import create_notification
        create_notification(
            db=db,
            user_id=str(current_user.id),
            title="Profile Updated",
            content="Your account profile has been updated successfully.",
            type="system",
            category="Account",
            is_critical=False
        )
    except Exception as e:
        pass # Non-blocking
        
    return current_user

from fastapi import UploadFile, File
from ...core.config import settings

@router.post("/me/photo", response_model=dict)
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a profile photo to Supabase storage and update the user's profile."""
    try:
        from supabase import create_client
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            raise HTTPException(status_code=500, detail="Supabase not configured")
            
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
        
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        file_name = f"profiles/{current_user.id}_{int(datetime.now().timestamp())}.{file_ext}"
        file_bytes = file.file.read()
        
        # We can reuse the captures bucket, or assume a profiles bucket exists.
        # Captures bucket is guaranteed to exist. We'll use a profiles/ folder inside it.
        supabase.storage.from_("captures").upload(
            file_name, 
            file_bytes,
            file_options={"content-type": file.content_type}
        )
        
        public_url = supabase.storage.from_("captures").get_public_url(file_name)
        
        # Update user
        current_user.photo_url = public_url
        db.commit()
        db.refresh(current_user)
        
        return {"success": True, "photo_url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload photo: {str(e)}")

@router.get("/me/profile")
def get_full_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get the full user profile including aggregated statistics."""
    
    # Base user dict
    user_dict = {
        "id": str(current_user.id),
        "firebase_uid": current_user.firebase_uid,
        "email": current_user.email,
        "display_name": current_user.display_name,
        "photo_url": current_user.photo_url,
        "username": current_user.username,
        "bio": current_user.bio,
        "timezone": current_user.timezone,
        "language": current_user.language,
        "country": current_user.country,
        "occupation": current_user.occupation,
        "website": current_user.website,
        "social_links": current_user.social_links,
        "birthday": current_user.birthday.isoformat() if current_user.birthday else None,
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
        "last_sync": current_user.last_sync.isoformat() if current_user.last_sync else None,
        "current_streak": current_user.current_streak,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None,
    }
    
    # Calculate statistics
    stats = {
        "timeline_memories": 0,
        "captures_total": 0,
        "workspaces": 0,
        "ai_conversations": 0,
        "knowledge_graph_entities": 0,
        "storage_used_bytes": 0
    }
    
    if Capture:
        stats["timeline_memories"] = db.query(func.count(Capture.id)).filter(Capture.user_id == current_user.id).scalar() or 0
        stats["captures_total"] = db.query(func.count(Capture.id)).filter(Capture.user_id == current_user.id).scalar() or 0
        
    if Workspace:
        try:
            stats["workspaces"] = db.query(func.count(Workspace.id)).filter(Workspace.created_by == current_user.id).scalar() or 0
        except Exception:
            pass
            
    persona_data = None
    if Persona:
        persona = db.query(Persona).filter(Persona.user_id == current_user.id).first()
        if persona:
            persona_data = {
                "name": persona.name if hasattr(persona, "name") else "Your AI",
                "communication_style": persona.communication_style if hasattr(persona, "communication_style") else "Default",
                "learning_style": getattr(persona, "learning_style", "Standard"),
                "productivity_profile": getattr(persona, "productivity_profile", "Standard")
            }
            
    return {
        "user": user_dict,
        "statistics": stats,
        "persona": persona_data
    }

from .models import ExperienceSettings
from .schemas import ExperienceSettingsResponse, ExperienceSettingsUpdate

@router.get("/experience", response_model=ExperienceSettingsResponse)
def get_experience_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(ExperienceSettings).filter(ExperienceSettings.user_id == current_user.id).first()
    if not settings:
        settings = ExperienceSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/experience", response_model=ExperienceSettingsResponse)
def update_experience_settings(
    settings_update: ExperienceSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(ExperienceSettings).filter(ExperienceSettings.user_id == current_user.id).first()
    if not settings:
        settings = ExperienceSettings(user_id=current_user.id)
        db.add(settings)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

from .deletion_service import schedule_account_deletion, recover_account

@router.post("/me/delete")
async def delete_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Schedules the user's account for deletion (30-day grace period) 
    and logs them out of all devices by revoking Firebase refresh tokens.
    """
    try:
        user = await schedule_account_deletion(db, current_user)
        return {"success": True, "message": "Account scheduled for deletion.", "deletion_scheduled_at": user.deletion_scheduled_at}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/me/recover")
async def recover_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancels the pending deletion status, restoring full access.
    """
    try:
        user = await recover_account(db, current_user)
        return {"success": True, "message": "Account recovered successfully.", "account_status": user.account_status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
