import uuid
from sqlalchemy.orm import Session
from sqlalchemy import desc
from .models import Notification
from ...modules.users.models import User
from typing import List

def get_notifications(db: Session, user: User, skip: int = 0, limit: int = 50) -> List[Notification]:
    return db.query(Notification).filter(
        Notification.user_id == user.id,
        Notification.is_archived == False
    ).order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()

def mark_as_read(db: Session, user: User, notification_id: uuid.UUID) -> bool:
    notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if notif:
        notif.is_read = True
        db.commit()
        return True
    return False

def mark_all_as_read(db: Session, user: User):
    db.query(Notification).filter(Notification.user_id == user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()

def clear_all_notifications(db: Session, user: User):
    db.query(Notification).filter(Notification.user_id == user.id).delete()
    db.commit()

def archive_notification(db: Session, user: User, notification_id: uuid.UUID) -> bool:
    notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if notif:
        notif.is_archived = True
        db.commit()
        return True
    return False

def create_notification(
    db: Session, 
    user_id: str, 
    title: str, 
    content: str, 
    type: str = "system",
    is_critical: bool = False,
    related_capture_id: str = None,
    related_entity_id: str = None,
    action_type: str = None,
    action_data: dict = None
) -> Notification:
    notif = Notification(
        user_id=user_id,
        title=title,
        content=content,
        type=type,
        is_critical=is_critical,
        related_capture_id=related_capture_id,
        related_entity_id=related_entity_id,
        action_type=action_type,
        action_data=action_data
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    
    # Send FCM push notification if user has a token and preferences allow it
    user = db.query(User).filter(User.id == user_id).first()
    if user and user.fcm_token:
        # Check preferences based on notification type
        prefs = user.notification_preferences or {}
        
        # Determine preference key based on type
        # e.g. reminder -> reminders, suggestion -> insights, insight -> insights, graph_discovery -> relationships
        pref_key = "system"
        if type == "reminder":
            pref_key = "reminders"
        elif type in ["suggestion", "insight", "duplicate", "activity"]:
            pref_key = "insights"
        elif type == "graph_discovery":
            pref_key = "relationships"
            
        if prefs.get(pref_key, True):
            try:
                from firebase_admin import messaging
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=title,
                        body=content,
                    ),
                    data={
                        "type": type,
                        "action_type": action_type or "",
                        "related_capture_id": str(related_capture_id) if related_capture_id else "",
                        "related_entity_id": str(related_entity_id) if related_entity_id else ""
                    },
                    token=user.fcm_token,
                )
                messaging.send(message)
                print(f"Sent push notification to user {user_id}")
            except Exception as e:
                print(f"Failed to send FCM push notification: {e}")
                
    return notif
