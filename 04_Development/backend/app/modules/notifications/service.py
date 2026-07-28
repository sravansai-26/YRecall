import uuid
from sqlalchemy.orm import Session
from sqlalchemy import desc
from .models import Notification, NotificationSettings
from ...modules.users.models import User
from typing import List
from fastapi import BackgroundTasks
import threading
from .email_service import generate_notification_email_html, send_email_sync

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

def get_notification_settings(db: Session, user: User) -> NotificationSettings:
    settings = db.query(NotificationSettings).filter(NotificationSettings.user_id == user.id).first()
    if not settings:
        settings = NotificationSettings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_notification_settings(db: Session, user: User, update_data: dict) -> NotificationSettings:
    settings = get_notification_settings(db, user)
    for key, value in update_data.items():
        if hasattr(settings, key) and value is not None:
            setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings

def create_notification(
    db: Session, 
    user_id: str, 
    title: str, 
    content: str, 
    type: str = "system",
    category: str = "System",
    is_critical: bool = False,
    related_capture_id: str = None,
    related_entity_id: str = None,
    action_type: str = None,
    action_data: dict = None,
    background_tasks: BackgroundTasks = None
) -> Notification:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    settings = get_notification_settings(db, user)
    
    # Engine Logic: Check if category is enabled (skip if false, unless critical)
    cat_prefs = settings.categories.get(category, {})
    if not is_critical and cat_prefs.get("enabled") is False:
        return None

    notif = Notification(
        user_id=user_id,
        title=title,
        content=content,
        type=type,
        category=category,
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
    if user and user.fcm_token:
        delivery_channels = settings.delivery_channels or {}
        push_enabled = delivery_channels.get("push", True)
        
        # Allow category level override
        if "push" in cat_prefs:
            push_enabled = cat_prefs["push"]
            
        if push_enabled or is_critical:
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
                
    # --- Email Dispatch Logic ---
    # Trigger emails for specific important conditions.
    # 1. New account signup / deletion (usually category="Account")
    # 2. Very high priority (is_critical = True)
    # 3. Emergency alerts (category="Emergency")
    # 4. App updates (category="System" and specific title maybe, or let's assume 'System' for major updates)
    send_email = False
    
    # Check user delivery preferences for email
    email_enabled = True
    if settings and settings.delivery_channels:
        email_enabled = settings.delivery_channels.get("email", True)
        
    if "email" in cat_prefs:
        email_enabled = cat_prefs["email"]
        
    if email_enabled or is_critical:
        if is_critical or category == "Emergency":
            send_email = True
        elif category == "Account" and ("welcome" in title.lower() or "delet" in title.lower() or "sign up" in title.lower()):
            send_email = True
        elif category == "System" and ("update" in title.lower() or "new feature" in title.lower()):
            send_email = True

    if send_email and user and user.email:
        html_content = generate_notification_email_html(title, content, action_type)
        if background_tasks:
            background_tasks.add_task(send_email_sync, user.email, title, html_content)
        else:
            threading.Thread(target=send_email_sync, args=(user.email, title, html_content)).start()
                
    return notif
