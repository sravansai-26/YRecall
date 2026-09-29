import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .config import settings
from ..modules.users.models import User

import json
import hmac
import hashlib
import time

import logging
logger = logging.getLogger(__name__)

def generate_signed_url_token(capture_id: str, expires_in: int = 3600) -> str:
    expires = int(time.time()) + expires_in
    data = f"{capture_id}:{expires}"
    sig = hmac.new(
        settings.SUPABASE_SERVICE_KEY.encode('utf-8'),
        data.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return f"{data}:{sig}"

def verify_signed_url_token(capture_id: str, token: str) -> bool:
    try:
        parts = token.split(":")
        if len(parts) != 3:
            return False
        cid, expires_str, sig = parts
        if cid != capture_id:
            return False
        if int(time.time()) > int(expires_str):
            return False
        
        expected_data = f"{cid}:{expires_str}"
        expected_sig = hmac.new(
            settings.SUPABASE_SERVICE_KEY.encode('utf-8'),
            expected_data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_sig, sig)
    except Exception:
        return False


# Initialize Firebase Admin at module load
def init_firebase():
    if not firebase_admin._apps:
        try:
            if settings.FIREBASE_SERVICE_ACCOUNT_JSON:
                # Load from JSON string (production approach)
                # Azure sometimes wraps the secret value in outer single-quotes: '{"type":...}'
                raw = settings.FIREBASE_SERVICE_ACCOUNT_JSON.strip()
                if raw.startswith("'") and raw.endswith("'"):
                    raw = raw[1:-1]
                try:
                    cert_dict = json.loads(raw)
                except json.JSONDecodeError:
                    # Fallback: unescape unicode escape sequences (e.g. \\n -> \n in private_key)
                    json_str = raw.encode('utf-8').decode('unicode_escape')
                    cert_dict = json.loads(json_str)
                
                cred = credentials.Certificate(cert_dict)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin initialized via JSON string.")
                print("FIREBASE INIT SUCCESS: Firebase Admin initialized via JSON string.", flush=True)
            elif settings.FIREBASE_SERVICE_ACCOUNT_PATH and os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
                # Load from local file (development approach)
                cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin initialized via JSON file path.")
                print("FIREBASE INIT SUCCESS: Firebase Admin initialized via JSON file path.", flush=True)
            else:
                logger.warning("Neither FIREBASE_SERVICE_ACCOUNT_JSON nor a valid FIREBASE_SERVICE_ACCOUNT_PATH was provided. Auth will fail.")
                print("FIREBASE INIT WARNING: Neither JSON nor PATH provided.", flush=True)
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin: {e}", exc_info=True)
            print(f"FIREBASE INIT ERROR: {repr(e)}", flush=True)
            import traceback
            traceback.print_exc()
            # DO NOT swallow the exception silently. Let it be known!
            raise RuntimeError(f"Firebase Admin Initialization Error: {str(e)}")

# Attempt initialization
init_firebase()

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verifies the Firebase JWT token and returns the decoded token."""
    if not firebase_admin._apps:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "Firebase Admin SDK is not initialized correctly on the server.",
                    "details": ["The default Firebase app does not exist."]
                }
            }
        )
    
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Invalid or expired token."
                }
            }
        )

def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
) -> User:
    """Gets the current user from the DB. Creates the user if they don't exist."""
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    try:
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        # Auto-create user on first sign-in
        if not user:
            email = decoded_token.get("email")
            display_name = decoded_token.get("name")
            photo_url = decoded_token.get("picture")

            user = User(
                firebase_uid=firebase_uid,
                email=email,
                display_name=display_name,
                photo_url=photo_url
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            try:
                from ..modules.notifications.service import create_notification
                create_notification(
                    db=db,
                    user_id=str(user.id),
                    title="Welcome to YRecall!",
                    content=f"Hi {display_name or 'there'},\n\nWelcome to YRecall, your AI Life Operating System. Your digital brain is ready to be populated.",
                    type="system",
                    category="Account",
                    is_critical=True
                )
            except Exception as e:
                pass # Non-blocking

        else:
            # Handle login alerts
            auth_time = decoded_token.get("auth_time")
            if auth_time:
                from datetime import datetime, timezone
                auth_datetime = datetime.fromtimestamp(auth_time, tz=timezone.utc)
                
                # Compare in python first to avoid unnecessary DB hits if already updated
                if not user.last_login or user.last_login < auth_datetime:
                    from sqlalchemy import update
                    stmt = update(User).where(
                        User.id == user.id,
                        (User.last_login == None) | (User.last_login < auth_datetime)
                    ).values(last_login=auth_datetime)
                    
                    result = db.execute(stmt)
                    db.commit()
                    
                    if result.rowcount > 0:
                        try:
                            from ..modules.notifications.service import create_notification
                            create_notification(
                                db=db,
                                user_id=str(user.id),
                                title="New Login Detected",
                                content=f"Hi {user.display_name or 'there'},\n\nWe detected a new login to your YRecall account. If this was you, you can safely ignore this email.",
                                type="security",
                                category="Account",
                                is_critical=True
                            )
                        except Exception:
                            pass
                        db.refresh(user)

        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during user authentication."
        )
