from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Dict, Any, List

from .models import DailyBrief, UserInsight, UserStreak
from ..captures.models import Capture
from ...core.database import get_db

def get_dashboard_data(db: Session, user_id: str, workspace_id: str = None) -> Dict[str, Any]:
    today = datetime.now().date()
    
    # 1. Get Daily Brief
    brief = db.query(DailyBrief).filter(
        DailyBrief.user_id == user_id,
        DailyBrief.date == today
    ).first()
    
    # 2. Get Insights (Latest 3)
    insights = db.query(UserInsight).filter(
        UserInsight.user_id == user_id
    ).order_by(UserInsight.created_at.desc()).limit(3).all()
    
    # 3. Get Streaks
    streaks = db.query(UserStreak).filter(
        UserStreak.user_id == user_id
    ).all()
    
    # 4. Get Highlights (Recent captures with high relevance or just recent ones for now)
    query_highlights = db.query(Capture).filter(Capture.deleted_at == None)
    if workspace_id:
        from ..collaboration.models import SharedCapture
        query_highlights = query_highlights.join(SharedCapture, SharedCapture.capture_id == Capture.id).filter(SharedCapture.workspace_id == workspace_id)
    else:
        query_highlights = query_highlights.filter(Capture.user_id == user_id)
    highlights = query_highlights.order_by(Capture.created_at.desc()).limit(5).all()

    # 5. Get "Continue Where You Left Off" (recent uncompleted or processing captures, or drafts)
    query_recent = db.query(Capture).filter(Capture.deleted_at == None)
    if workspace_id:
        from ..collaboration.models import SharedCapture
        query_recent = query_recent.join(SharedCapture, SharedCapture.capture_id == Capture.id).filter(SharedCapture.workspace_id == workspace_id)
    else:
        query_recent = query_recent.filter(Capture.user_id == user_id)
    recent = query_recent.order_by(Capture.created_at.desc()).limit(3).all()

    # 6. Get Reminders (Actionable tasks)
    from ..automation.models import Reminder
    query_reminders = db.query(Reminder).filter(Reminder.status == "pending")
    if workspace_id:
        query_reminders = query_reminders.filter(Reminder.workspace_id == workspace_id) if hasattr(Reminder, 'workspace_id') else query_reminders.filter(False)
    else:
        query_reminders = query_reminders.filter(Reminder.user_id == user_id)
    reminders = query_reminders.order_by(Reminder.due_date.asc().nulls_last()).limit(5).all()

    return {
        "daily_brief": {
            "summary_text": brief.summary_text if brief else None,
            "metrics": brief.metrics if brief else {},
            "date": brief.date.isoformat() if brief else None,
            "priorities": brief.priorities if brief else [],
        },
        "insights": [
            {"id": str(i.id), "text": i.insight_text, "type": i.insight_type} 
            for i in insights
        ],
        "streaks": [
            {"type": s.streak_type, "count": s.current_count, "highest": s.highest_count} 
            for s in streaks
        ],
        "highlights": [
            {
                "id": str(h.id), 
                "type": h.type, 
                "title": h.title, 
                "summary": h.summary,
                "created_at": h.created_at.isoformat()
            } for h in highlights
        ],
        "continue_items": [
            {
                "id": str(r.id), 
                "type": r.type, 
                "title": r.title,
                "created_at": r.created_at.isoformat()
            } for r in recent
        ],
        "reminders": [
            {
                "id": str(r.id),
                "title": r.title,
                "description": r.description,
                "priority": r.priority,
                "due_date": r.due_date.isoformat() if r.due_date else None,
                "status": r.status
            } for r in reminders
        ]
    }

def get_analytics_data(db: Session, user_id: str, days: int = 7) -> Dict[str, Any]:
    start_date = datetime.now() - timedelta(days=days)
    
    # Captures per day
    daily_counts = db.query(
        func.date(Capture.created_at).label('date'),
        func.count(Capture.id).label('count')
    ).filter(
        Capture.user_id == user_id,
        Capture.created_at >= start_date,
        Capture.deleted_at == None
    ).group_by(func.date(Capture.created_at)).all()
    
    # Types distribution
    type_counts = db.query(
        Capture.type,
        func.count(Capture.id).label('count')
    ).filter(
        Capture.user_id == user_id,
        Capture.deleted_at == None
    ).group_by(Capture.type).all()
    
    return {
        "daily_captures": [{"date": str(d.date), "count": d.count} for d in daily_counts],
        "capture_types": [{"type": t.type, "count": t.count} for t in type_counts]
    }
