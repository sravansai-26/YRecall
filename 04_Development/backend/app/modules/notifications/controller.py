import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

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

@router.delete("/all", response_model=dict)
def clear_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service.clear_all_notifications(db, current_user)
    return {
        "success": True,
        "message": "All notifications cleared."
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

class TestNotificationRequest(BaseModel):
    category: str

@router.post("/test", response_model=dict)
def test_notification(
    req: TestNotificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = service.create_notification(
        db=db,
        user_id=str(current_user.id),
        title=f"Test: {req.category}",
        content=f"This is a simulated {req.category} notification from the Intelligent Notification Center.",
        type="system",
        category=req.category,
        is_critical=False
    )
    
    if not notif:
        raise HTTPException(status_code=400, detail=f"{req.category} notifications are currently disabled in your settings.")
        
    return {
        "success": True,
        "message": "Test notification sent."
    }

@router.get("/settings", response_model=dict)
def get_notification_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = service.get_notification_settings(db, current_user)
    return {
        "success": True,
        "data": schemas.NotificationSettingsResponse.model_validate(settings).model_dump()
    }

@router.patch("/settings", response_model=dict)
def update_notification_settings(
    settings_data: schemas.NotificationSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = service.update_notification_settings(db, current_user, settings_data.model_dump(exclude_unset=True))
    return {
        "success": True,
        "message": "Notification settings updated.",
        "data": schemas.NotificationSettingsResponse.model_validate(settings).model_dump()
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
