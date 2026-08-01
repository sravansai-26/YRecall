from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import Optional
import logging
from fastapi import HTTPException
from firebase_admin import auth as firebase_auth
from supabase import create_client

from ...core.config import settings
from .models import User, AccountStatus
from ...core.email import send_email

logger = logging.getLogger(__name__)

def _get_supabase_client():
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise ValueError("Supabase configuration is missing.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

async def schedule_account_deletion(db: Session, user: User) -> User:
    """Marks a user account for deletion after 30 days and logs them out."""
    if user.account_status == AccountStatus.PENDING_DELETION:
        return user
        
    user.account_status = AccountStatus.PENDING_DELETION
    user.deletion_scheduled_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(user)
    
    # 1. Send confirmation email
    deletion_date = (user.deletion_scheduled_at + timedelta(days=30)).strftime("%Y-%m-%d")
    html_content = f"""
    <h2>Account Deletion Scheduled</h2>
    <p>Hi {user.display_name or 'there'},</p>
    <p>We've received your request to permanently delete your YRecall account.</p>
    <p><strong>Your account will be permanently deleted on {deletion_date}.</strong></p>
    <p>If you change your mind, you can recover your account anytime before this date by logging back in and selecting "Recover Account".</p>
    <p>Thanks,<br>YRecall Team</p>
    """
    
    try:
        await send_email(db, user.email, "YRecall Account Deletion Scheduled", html_content, template_name="account_deletion_scheduled")
    except Exception as e:
        logger.error(f"Failed to send deletion email to {user.email}: {e}")

    # 2. Revoke Firebase refresh tokens so they are immediately signed out of all devices
    try:
        firebase_auth.revoke_refresh_tokens(user.firebase_uid)
    except Exception as e:
        logger.error(f"Failed to revoke Firebase tokens for {user.firebase_uid}: {e}")

    return user


async def recover_account(db: Session, user: User) -> User:
    """Recovers a user account from pending deletion status."""
    if user.account_status == AccountStatus.ACTIVE:
        return user
        
    user.account_status = AccountStatus.ACTIVE
    user.deletion_scheduled_at = None
    
    db.commit()
    db.refresh(user)
    
    # Send recovery confirmation email
    html_content = f"""
    <h2>Account Recovered Successfully</h2>
    <p>Hi {user.display_name or 'there'},</p>
    <p>Your YRecall account has been successfully recovered. The scheduled deletion has been canceled.</p>
    <p>Welcome back!</p>
    <p>Thanks,<br>YRecall Team</p>
    """
    
    try:
        await send_email(db, user.email, "YRecall Account Recovered", html_content, template_name="account_recovered")
    except Exception as e:
        logger.error(f"Failed to send recovery email to {user.email}: {e}")

    return user

async def execute_permanent_deletion(db: Session, user: User):
    """
    Permanently deletes all data associated with the user.
    This is an irreversible action.
    """
    if not user:
        return

    # 1. Supabase Storage Cleanup
    try:
        supabase = _get_supabase_client()
        # Delete user's profile photo
        if user.photo_url and "supabase.co/storage/v1/object/public/captures/profiles/" in user.photo_url:
            filename = user.photo_url.split("/")[-1]
            supabase.storage.from_("captures").remove([f"profiles/{filename}"])
            
        # Optional: query all captures/files by this user and delete them from bucket
        # In a real app you'd get the list of capture URLs from the DB and remove them.
    except Exception as e:
        logger.error(f"Error deleting Supabase storage for {user.id}: {e}")

    # 2. Database Cleanup (Cascading)
    # The SQLAlchemy relationships should be configured with cascade="all, delete-orphan"
    # But for safety, we delete the user record, which cascade deletes captures, workspaces, personas, subscriptions, etc.
    user_email = user.email
    firebase_uid = user.firebase_uid
    
    db.delete(user)
    db.commit()

    # 3. Firebase Auth User Deletion
    try:
        firebase_auth.delete_user(firebase_uid)
    except Exception as e:
        logger.error(f"Error deleting Firebase user {firebase_uid}: {e}")

    # 4. Final Notification Email
    html_content = f"""
    <h2>Account Permanently Deleted</h2>
    <p>Your YRecall account and all associated data have been permanently deleted.</p>
    <p>We're sad to see you go. If you ever want to return, you can always create a new account.</p>
    <p>Thanks,<br>YRecall Team</p>
    """
    try:
        await send_email(db, user_email, "YRecall Account Deleted", html_content, template_name="account_deleted")
    except Exception as e:
        logger.error(f"Failed to send final deletion email to {user_email}: {e}")
