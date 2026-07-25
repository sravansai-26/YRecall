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

# --- AUTOMATION CENTER ENDPOINTS ---

@router.get("/stats", response_model=schemas.AutomationStatsResponse)
def get_automation_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workflows = db.query(models.AutomationWorkflow).filter(models.AutomationWorkflow.user_id == current_user.id).all()
    running = sum(1 for w in workflows if w.is_active)
    paused = len(workflows) - running
    
    executions = db.query(models.AutomationExecution).join(models.AutomationWorkflow).filter(models.AutomationWorkflow.user_id == current_user.id).all()
    failed = sum(1 for e in executions if e.status == "failed")
    completed = sum(1 for e in executions if e.status == "success")
    success_rate = (completed / len(executions) * 100) if executions else 100.0
    
    return {
        "running_automations": running,
        "scheduled": 0, # Pending queue integration
        "paused": paused,
        "completed_today": completed, # Simulated for today
        "completed_this_week": completed, 
        "failed_executions": failed,
        "pending_approvals": 0,
        "queued_jobs": 0,
        "success_rate": round(success_rate, 1)
    }

@router.get("/workflows", response_model=List[schemas.AutomationWorkflowResponse])
def list_workflows(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workflows = db.query(models.AutomationWorkflow).filter(models.AutomationWorkflow.user_id == current_user.id).order_by(models.AutomationWorkflow.created_at.desc()).all()
    result = []
    for w in workflows:
        result.append({
            "id": w.id,
            "name": w.name,
            "description": w.description,
            "is_active": w.is_active,
            "created_at": w.created_at,
            "updated_at": w.updated_at,
            "triggers": [{"trigger_type": t.trigger_type, "configuration": t.configuration} for t in w.triggers],
            "actions": [{"action_type": a.action_type, "configuration": a.configuration} for a in w.actions],
            "conditions": [{"condition_type": c.condition_type, "configuration": c.configuration} for c in w.conditions]
        })
    return result

@router.post("/workflows", response_model=schemas.AutomationWorkflowResponse)
def create_workflow(
    workflow: schemas.AutomationWorkflowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_wf = models.AutomationWorkflow(
        user_id=current_user.id,
        name=workflow.name,
        description=workflow.description,
        is_active=True
    )
    db.add(db_wf)
    db.flush()
    
    for trigger in workflow.triggers:
        db.add(models.AutomationTrigger(workflow_id=db_wf.id, trigger_type=trigger.trigger_type, configuration=trigger.configuration))
    
    for order, action in enumerate(workflow.actions):
        db.add(models.AutomationAction(workflow_id=db_wf.id, action_type=action.action_type, configuration=action.configuration, order=order))
        
    for cond in workflow.conditions:
        db.add(models.WorkflowCondition(workflow_id=db_wf.id, condition_type=cond.condition_type, configuration=cond.configuration))
        
    db.commit()
    db.refresh(db_wf)
    
    # Return formatted response
    return {
        "id": db_wf.id,
        "name": db_wf.name,
        "description": db_wf.description,
        "is_active": db_wf.is_active,
        "created_at": db_wf.created_at,
        "updated_at": db_wf.updated_at,
        "triggers": [{"trigger_type": t.trigger_type, "configuration": t.configuration} for t in db_wf.triggers],
        "actions": [{"action_type": a.action_type, "configuration": a.configuration} for a in db_wf.actions],
        "conditions": [{"condition_type": c.condition_type, "configuration": c.configuration} for c in db_wf.conditions]
    }

@router.put("/workflows/{workflow_id}")
def update_workflow(
    workflow_id: UUID,
    workflow_update: schemas.AutomationWorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_wf = db.query(models.AutomationWorkflow).filter(
        models.AutomationWorkflow.id == workflow_id,
        models.AutomationWorkflow.user_id == current_user.id
    ).first()
    
    if not db_wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
        
    for key, value in workflow_update.model_dump(exclude_unset=True).items():
        setattr(db_wf, key, value)
        
    db.commit()
    return {"status": "success"}

@router.delete("/workflows/{workflow_id}")
def delete_workflow(
    workflow_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_wf = db.query(models.AutomationWorkflow).filter(
        models.AutomationWorkflow.id == workflow_id,
        models.AutomationWorkflow.user_id == current_user.id
    ).first()
    
    if not db_wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
        
    db.delete(db_wf)
    db.commit()
    return {"status": "success"}

@router.get("/executions", response_model=List[schemas.AutomationExecutionResponse])
def list_executions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    executions = db.query(models.AutomationExecution).join(models.AutomationWorkflow).filter(
        models.AutomationWorkflow.user_id == current_user.id
    ).order_by(models.AutomationExecution.started_at.desc()).limit(50).all()
    
    result = []
    for e in executions:
        result.append({
            "id": e.id,
            "workflow_id": e.workflow_id,
            "workflow_name": e.workflow.name,
            "status": e.status,
            "started_at": e.started_at,
            "completed_at": e.completed_at,
            "error_message": e.error_message,
            "logs": [{"message": l.message, "level": l.level, "created_at": l.created_at} for l in e.logs]
        })
    return result
