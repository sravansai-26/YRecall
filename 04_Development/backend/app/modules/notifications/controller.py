import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from . import service
from . import schemas
from .schemas import NotificationResponse
from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

router = APIRouter()

@router.get("", response_model=dict)
def get_notifications(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifs = service.get_notifications(db, current_user, skip, limit)
    unread_count = sum(1 for n in notifs if not n.is_read)
    
    return {
        "success": True,
        "message": "Operation completed successfully.",
        "data": [NotificationResponse.model_validate(n).model_dump() for n in notifs],
        "meta": {
            "unread_count": unread_count
        }
    }

@router.post("/{id}/read", response_model=dict)
def mark_notification_read(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = service.mark_as_read(db, current_user, id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {
        "success": True,
        "message": "Marked as read."
    }

@router.post("/read-all", response_model=dict)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service.mark_all_as_read(db, current_user)
    return {
        "success": True,
        "message": "All marked as read."
    }

@router.delete("/{id}", response_model=dict)
def archive_notification(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = service.archive_notification(db, current_user, id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {
        "success": True,
        "message": "Notification archived."
    }

@router.get("/settings", response_model=dict)
def get_notification_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "data": current_user.notification_preferences or {
            "reminders": True,
            "insights": True,
            "relationships": True,
            "system": True
        }
    }

@router.put("/settings", response_model=dict)
def update_notification_settings(
    settings_data: schemas.NotificationSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.notification_preferences = settings_data.model_dump()
    db.commit()
    return {
        "success": True,
        "message": "Settings updated successfully."
    }

@router.put("/fcm-token", response_model=dict)
def update_fcm_token(
    token_data: schemas.FCMTokenUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.fcm_token = token_data.fcm_token
    db.commit()
    return {
        "success": True,
        "message": "FCM token updated successfully."
    }
