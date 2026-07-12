from sqlalchemy.orm import Session
from datetime import datetime
import dateutil.parser
from .models import Reminder, AutomationSuggestion
import uuid

def execute_intent(db: Session, user_id: str, capture_id: str, intent: dict):
    """
    Executes a specific intent detected by the Intent Engine.
    Currently supports: 'create_reminder'
    """
    action_type = intent.get("action_type")
    
    if action_type == "create_reminder":
        confidence = intent.get("confidence", 0.0)
        
        # If confidence is low, create a suggestion instead of a direct reminder
        if confidence < 0.8:
            suggestion = AutomationSuggestion(
                user_id=user_id,
                source_capture_id=capture_id,
                suggestion_type="create_reminder",
                proposed_configuration=intent,
                reasoning=intent.get("reasoning", "Confidence was too low for automatic creation.")
            )
            db.add(suggestion)
            db.commit()
            return

        due_date = intent.get("due_date")
        if due_date:
            try:
                due_date = dateutil.parser.isoparse(due_date)
            except Exception:
                due_date = None

        reminder = Reminder(
            user_id=user_id,
            title=intent.get("title", "Untitled Reminder"),
            description=intent.get("description", ""),
            priority=intent.get("priority", "medium"),
            due_date=due_date,
            source_capture_id=capture_id,
            created_by_automation=True,
            confidence_score=confidence,
            ai_reasoning=intent.get("reasoning", "")
        )
        db.add(reminder)
        db.flush() # get reminder.id
        
        # Add to timeline as an automation capture
        from ..captures.models import Capture
        system_capture = Capture(
            user_id=user_id,
            type="automation",
            title="AI created a reminder",
            content_text=f"Automatically created reminder: {reminder.title}",
            status="completed"
        )
        db.add(system_capture)
        db.commit()
        
    elif action_type == "create_task":
        # Can map to reminder for now
        pass
        
    elif action_type == "create_workflow":
        # Create a suggestion for a workflow
        suggestion = AutomationSuggestion(
            user_id=user_id,
            source_capture_id=capture_id,
            suggestion_type="create_workflow",
            proposed_configuration=intent,
            reasoning=intent.get("reasoning", "Suggested workflow based on repeated patterns.")
        )
        db.add(suggestion)
        db.commit()
