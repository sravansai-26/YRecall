import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from .config import settings
from ..modules.users.models import User

# Initialize Firebase Admin
if settings.FIREBASE_SERVICE_ACCOUNT_PATH and os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
else:
    # Initialize with default app if credentials aren't found locally (e.g. deployed environments)
    # or print a warning
    print(f"WARNING: Firebase service account path not found at {settings.FIREBASE_SERVICE_ACCOUNT_PATH}. Auth will fail.")

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verifies the Firebase JWT token and returns the decoded token."""
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
                    "message": "Invalid or expired token.",
                    "details": [str(e)]
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
