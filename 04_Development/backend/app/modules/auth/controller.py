import random
import string
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from firebase_admin import auth as firebase_auth

from ...core.database import get_db
from ...core.email import send_password_reset_otp_email, send_password_changed_email, send_email_verification_otp_email
from .schemas import PasswordResetRequest, PasswordResetVerify, PasswordResetComplete, PasswordResetResponse, EmailVerificationRequest, EmailVerificationVerify, EmailVerificationResponse
from .models import PasswordResetOTP

router = APIRouter(tags=["auth"])

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

@router.post("/email-verification/request", response_model=EmailVerificationResponse)
async def request_email_verification(
    request: EmailVerificationRequest,
    db: Session = Depends(get_db)
):
    email = request.email.lower().strip()
    
    try:
        user_record = firebase_auth.get_user_by_email(email)
    except firebase_auth.UserNotFoundError:
        raise HTTPException(status_code=400, detail="Account not found.")
        
    if user_record.email_verified:
        raise HTTPException(status_code=400, detail="Email is already verified.")
        
    providers = [provider.provider_id for provider in user_record.provider_data]
    if 'google.com' in providers and 'password' not in providers:
        raise HTTPException(status_code=400, detail="This account is managed by Google.")

    # Invalidate previous active OTPs for this email and purpose
    db.query(PasswordResetOTP).filter(
        PasswordResetOTP.email == email,
        PasswordResetOTP.purpose == "email_verification",
        PasswordResetOTP.is_used == False
    ).update({"is_used": True})
    
    otp = ''.join(random.choices(string.digits, k=6))
    
    expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    db_otp = PasswordResetOTP(
        email=email,
        purpose="email_verification",
        otp_hash=hash_token(otp),
        expires_at=expires,
        attempts=0,
        max_attempts=5,
        is_used=False
    )
    db.add(db_otp)
    db.commit()
    
    await send_email_verification_otp_email(db, email, otp)
    
    return EmailVerificationResponse(success=True, message="Verification code sent.")

@router.post("/email-verification/verify", response_model=EmailVerificationResponse)
async def verify_email(
    request: EmailVerificationVerify,
    db: Session = Depends(get_db)
):
    email = request.email.lower().strip()
    
    db_otp = db.query(PasswordResetOTP).filter(
        PasswordResetOTP.email == email,
        PasswordResetOTP.purpose == "email_verification",
        PasswordResetOTP.is_used == False,
        PasswordResetOTP.expires_at > datetime.now(timezone.utc)
    ).order_by(PasswordResetOTP.created_at.desc()).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")
        
    if db_otp.attempts >= db_otp.max_attempts:
        db_otp.is_used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Too many incorrect attempts. Please request a new code.")
        
    if db_otp.otp_hash != hash_token(request.code.strip()):
        db_otp.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid verification code.")
        
    db_otp.is_used = True
    db_otp.used_at = datetime.now(timezone.utc)
    db.commit()
    
    try:
        user_record = firebase_auth.get_user_by_email(db_otp.email)
        firebase_auth.update_user(
            user_record.uid,
            email_verified=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to mark email as verified.")
    
    return EmailVerificationResponse(success=True, message="Email verified successfully.")

@router.post("/password-reset/request", response_model=PasswordResetResponse)
async def request_password_reset(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    email = request.email.lower().strip()
    generic_message = "If an account can be recovered, we've sent a verification code to your email."
    
    # Check Firebase user
    try:
        user_record = firebase_auth.get_user_by_email(email)
    except firebase_auth.UserNotFoundError:
        return PasswordResetResponse(success=True, message=generic_message)
    except Exception as e:
        # Avoid leaking errors about email existence
        return PasswordResetResponse(success=True, message=generic_message)

    # Check if this user is a Google-only user
    # A Google-only user has 'google.com' in provider_data and NO 'password' provider
    providers = [provider.provider_id for provider in user_record.provider_data]
    if 'google.com' in providers and 'password' not in providers:
        # Silently ignore the request for Google-only users to prevent enumeration,
        # but the mobile app will try to warn the user using fetchSignInMethodsForEmail anyway.
        return PasswordResetResponse(success=True, message=generic_message)
        
    # Invalidate previous active OTPs for this email
    db.query(PasswordResetOTP).filter(
        PasswordResetOTP.email == email,
        PasswordResetOTP.purpose == "password_reset",
        PasswordResetOTP.is_used == False
    ).update({"is_used": True})
    
    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Create DB record
    expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    db_otp = PasswordResetOTP(
        email=email,
        otp_hash=hash_token(otp),
        expires_at=expires,
        attempts=0,
        max_attempts=5,
        is_used=False
    )
    db.add(db_otp)
    db.commit()
    
    # Send email
    await send_password_reset_otp_email(db, email, otp)
    
    return PasswordResetResponse(success=True, message=generic_message)


@router.post("/password-reset/verify", response_model=PasswordResetResponse)
async def verify_password_reset(
    request: PasswordResetVerify,
    db: Session = Depends(get_db)
):
    email = request.email.lower().strip()
    
    db_otp = db.query(PasswordResetOTP).filter(
        PasswordResetOTP.email == email,
        PasswordResetOTP.purpose == "password_reset",
        PasswordResetOTP.is_used == False,
        PasswordResetOTP.expires_at > datetime.now(timezone.utc)
    ).order_by(PasswordResetOTP.created_at.desc()).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")
        
    if db_otp.attempts >= db_otp.max_attempts:
        db_otp.is_used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Too many incorrect attempts. Please request a new code.")
        
    if db_otp.otp_hash != hash_token(request.code.strip()):
        db_otp.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid verification code.")
        
    # Generate reset session token
    reset_token = secrets.token_urlsafe(32)
    db_otp.reset_session_hash = hash_token(reset_token)
    db_otp.is_used = True
    db_otp.used_at = datetime.now(timezone.utc)
    db.commit()
    
    return PasswordResetResponse(
        success=True, 
        message="Code verified successfully.", 
        reset_token=reset_token
    )


@router.post("/password-reset/complete", response_model=PasswordResetResponse)
async def complete_password_reset(
    request: PasswordResetComplete,
    db: Session = Depends(get_db)
):
    reset_hash = hash_token(request.reset_token)
    
    # Find the OTP record that authorized this reset
    db_otp = db.query(PasswordResetOTP).filter(
        PasswordResetOTP.reset_session_hash == reset_hash
    ).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired reset session.")
        
    # Check if the reset session has been used or if it's too old (e.g., > 30 minutes from creation)
    # used_at holds the time when the OTP was verified. We allow 15 minutes to complete the reset.
    if not db_otp.used_at or (datetime.now(timezone.utc) - db_otp.used_at) > timedelta(minutes=15):
        # Invalidate the session
        db_otp.reset_session_hash = None
        db.commit()
        raise HTTPException(status_code=400, detail="Reset session expired. Please start over.")
        
    # Update Firebase user
    try:
        user_record = firebase_auth.get_user_by_email(db_otp.email)
        firebase_auth.update_user(
            user_record.uid,
            password=request.new_password
        )
        # Revoke existing sessions
        firebase_auth.revoke_refresh_tokens(user_record.uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update password securely.")
        
    # Invalidate session to prevent reuse
    db_otp.reset_session_hash = None
    db.commit()
    
    # Send confirmation email
    await send_password_changed_email(db, db_otp.email)
    
    return PasswordResetResponse(success=True, message="Password updated successfully.")
