from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User
from . import schemas, models
from .models import SecuritySettings, DeviceSession, SecurityAuditLog

router = APIRouter(tags=["security"])

def log_security_event(db: Session, user_id: UUID, event_type: str, device_id: Optional[str] = None, ip_address: Optional[str] = None, details: dict = None):
    log = SecurityAuditLog(
        user_id=user_id,
        event_type=event_type,
        device_id=device_id,
        ip_address=ip_address,
        details=details or {}
    )
    db.add(log)
    db.commit()

@router.get("/settings", response_model=schemas.SecuritySettingsResponse)
def get_security_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(SecuritySettings).filter(SecuritySettings.user_id == current_user.id).first()
    if not settings:
        settings = SecuritySettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=schemas.SecuritySettingsResponse)
def update_security_settings(
    settings_update: schemas.SecuritySettingsUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(SecuritySettings).filter(SecuritySettings.user_id == current_user.id).first()
    if not settings:
        settings = SecuritySettings(user_id=current_user.id)
        db.add(settings)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    
    log_security_event(
        db, current_user.id, "settings_changed", 
        ip_address=request.client.host,
        details={"changes": update_data}
    )
    return settings

@router.get("/sessions", response_model=List[schemas.DeviceSessionResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only return active sessions
    return db.query(DeviceSession).filter(
        DeviceSession.user_id == current_user.id,
        DeviceSession.revoked_at.is_(None)
    ).order_by(DeviceSession.last_active_at.desc()).all()

@router.delete("/sessions/{session_id}")
def revoke_session(
    session_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(DeviceSession).filter(
        DeviceSession.id == session_id,
        DeviceSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session.revoked_at = datetime.utcnow()
    db.commit()
    
    log_security_event(
        db, current_user.id, "session_revoked", 
        device_id=session.device_id,
        ip_address=request.client.host
    )
    return {"status": "success"}

@router.put("/sessions/{session_id}/trust")
def update_session_trust(
    session_id: UUID,
    trust_update: schemas.DeviceSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(DeviceSession).filter(
        DeviceSession.id == session_id,
        DeviceSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if trust_update.is_trusted is not None:
        session.is_trusted = trust_update.is_trusted
    if trust_update.device_name is not None:
        session.device_name = trust_update.device_name
        
    db.commit()
    return {"status": "success"}

@router.get("/logs", response_model=List[schemas.SecurityAuditLogResponse])
def get_security_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(SecurityAuditLog).filter(
        SecurityAuditLog.user_id == current_user.id
    ).order_by(SecurityAuditLog.created_at.desc()).limit(100).all()

@router.post("/logs")
def create_client_log(
    log_in: schemas.SecurityAuditLogBase,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log_security_event(
        db, current_user.id, log_in.event_type, 
        device_id=log_in.device_id,
        ip_address=request.client.host,
        details=log_in.details
    )
    return {"status": "success"}
