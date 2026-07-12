from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User
from . import schemas, models

router = APIRouter(tags=["automation"])

@router.get("/reminders", response_model=List[schemas.ReminderResponse])
def get_reminders(
    status: str = "pending",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(models.Reminder).filter(models.Reminder.user_id == current_user.id)
    if status != "all":
        query = query.filter(models.Reminder.status == status)
    return query.order_by(models.Reminder.due_date.asc().nulls_last()).all()

@router.post("/reminders", response_model=schemas.ReminderResponse)
def create_reminder(
    reminder: schemas.ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_reminder = models.Reminder(
        user_id=current_user.id,
        title=reminder.title,
        description=reminder.description,
        priority=reminder.priority,
        due_date=reminder.due_date,
        source_capture_id=reminder.source_capture_id,
        created_by_automation=False
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    # Add timeline event
    from ..captures.models import Capture
    system_capture = Capture(
        user_id=current_user.id,
        type="automation",
        title="Created a reminder",
        content_text=f"Reminder created manually: {db_reminder.title}",
        status="completed"
    )
    db.add(system_capture)
    db.commit()
    
    return db_reminder

@router.put("/reminders/{reminder_id}", response_model=schemas.ReminderResponse)
def update_reminder(
    reminder_id: UUID,
    reminder_update: schemas.ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_reminder = db.query(models.Reminder).filter(
        models.Reminder.id == reminder_id,
        models.Reminder.user_id == current_user.id
    ).first()
    
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    for key, value in reminder_update.model_dump(exclude_unset=True).items():
        setattr(db_reminder, key, value)
        
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

@router.delete("/reminders/{reminder_id}")
def delete_reminder(
    reminder_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_reminder = db.query(models.Reminder).filter(
        models.Reminder.id == reminder_id,
        models.Reminder.user_id == current_user.id
    ).first()
    
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
        
    db_reminder.status = "deleted"
    db.commit()
    return {"status": "success"}

@router.get("/suggestions", response_model=List[schemas.AutomationSuggestionResponse])
def get_suggestions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(models.AutomationSuggestion).filter(
        models.AutomationSuggestion.user_id == current_user.id,
        models.AutomationSuggestion.status == "pending"
    ).order_by(models.AutomationSuggestion.created_at.desc()).all()

@router.post("/suggestions/{suggestion_id}/accept")
def accept_suggestion(
    suggestion_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    suggestion = db.query(models.AutomationSuggestion).filter(
        models.AutomationSuggestion.id == suggestion_id,
        models.AutomationSuggestion.user_id == current_user.id
    ).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
        
    if suggestion.suggestion_type == "create_reminder":
        from .action_executor import execute_intent
        execute_intent(db, str(current_user.id), str(suggestion.source_capture_id), suggestion.proposed_configuration)
        
    suggestion.status = "accepted"
    db.commit()
    return {"status": "success"}

@router.post("/suggestions/{suggestion_id}/dismiss")
def dismiss_suggestion(
    suggestion_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    suggestion = db.query(models.AutomationSuggestion).filter(
        models.AutomationSuggestion.id == suggestion_id,
        models.AutomationSuggestion.user_id == current_user.id
    ).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
        
    suggestion.status = "dismissed"
    db.commit()
    return {"status": "success"}
