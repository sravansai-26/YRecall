import json
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from ...core.config import settings
from ..users.models import User
from ..captures.models import Capture
from ..persona.prompt_builder import build_system_prompt
from .models import DailyBrief, UserInsight
from ...core.ai.router import ai_router
from ..ai.models import AIEmbedding
from ..automation.models import Reminder

def generate_daily_brief(db: Session, user_id: str) -> dict:
    """
    Generates a personalized Daily Brief based on the user's Persona and recent memories.
    Now leverages RAG to fetch historically relevant context if recent activity exists.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
        
    today = datetime.now().date()
    yesterday = datetime.now() - timedelta(days=1)
    
    # 1. Retrieve recent captures (last 48 hours for immediate context)
    recent_captures = db.query(Capture).filter(
        Capture.user_id == user_id,
        Capture.deleted_at == None,
        Capture.created_at >= yesterday
    ).all()
    
    # 2. Build semantic search query based on recent activity, or fallback to generic
    if recent_captures:
        recent_summaries = " ".join([c.title or "" for c in recent_captures])
        search_query = f"Related to: {recent_summaries[:500]}"
    else:
        search_query = "Important active tasks, ongoing projects, and unresolved goals."
        
    # 3. Retrieve semantically relevant older captures using pgvector
    query_embedding = ai_router.generate_embedding(text=search_query)
    
    semantic_results = db.query(
        Capture
    ).join(
        AIEmbedding, Capture.id == AIEmbedding.capture_id
    ).filter(
        Capture.deleted_at == None,
        Capture.user_id == user_id,
        Capture.created_at < yesterday # Avoid duplicating recent captures
    ).order_by(
        AIEmbedding.embedding.cosine_distance(query_embedding)
    ).limit(3).all()
    
    # 4. Fetch active pending reminders
    active_reminders = db.query(Reminder).filter(
        Reminder.user_id == user_id,
        Reminder.status == "pending"
    ).order_by(Reminder.due_date.asc().nulls_last()).limit(5).all()
    
    # 5. Construct unified context
    context_lines = []
    
    if active_reminders:
        context_lines.append("--- ACTIVE TASKS & REMINDERS ---")
        for r in active_reminders:
            due = r.due_date.isoformat() if r.due_date else 'No Date'
            context_lines.append(f"Task: {r.title} (Priority: {r.priority}, Due: {due})")
        context_lines.append("")
        
    if recent_captures:
        context_lines.append("--- RECENT MEMORIES (Last 48 hours) ---")
        for c in recent_captures:
            context_lines.append(f"- {c.title}: {c.summary or c.content_text[:200]}")
        context_lines.append("")
        
    if semantic_results:
        context_lines.append("--- RELEVANT PAST CONTEXT ---")
        for c in semantic_results:
            context_lines.append(f"- {c.title} (from {c.created_at.date()}): {c.summary or c.content_text[:200]}")
            
    context_str = "\n".join(context_lines)
    if not context_str.strip():
        context_str = "No recent memories, active tasks, or past context found."
        
    task_context = f"""
    Generate a personalized Daily Brief for the user for today.
    
    {context_str}
    
    INSTRUCTIONS:
    1. Read the User Persona, Behaviors, and Goals (provided in the system prompt).
    2. Read the unified context above.
    3. Generate a highly personalized 'summary_text' (2-3 paragraphs) that speaks directly to the user's profession, goals, and recent/relevant past activity.
    4. Provide 2-3 personalized 'priorities' for the day based on tasks and context.
    5. Generate 1-2 'insights' reflecting on their behavior or progress.
    
    Output strictly in JSON format:
    {{
        "summary_text": "Good morning! As a Founder... etc.",
        "priorities": ["Review Project X", "Read Y"],
        "insights": [
            {{"text": "You spent more time on backend architecture yesterday.", "type": "productivity"}}
        ],
        "metrics": {{"productivity_score": 85}}
    }}
    """
    
    system_prompt = build_system_prompt(db, user, "")
    
    data = ai_router.generate_json(
        task="background",
        prompt=task_context,
        system_prompt=system_prompt
    )
    
    # Save to database
    existing_brief = db.query(DailyBrief).filter(DailyBrief.user_id == user_id, DailyBrief.date == today).first()
    if existing_brief:
        existing_brief.summary_text = data.get("summary_text", "")
        existing_brief.priorities = data.get("priorities", [])
        existing_brief.metrics = data.get("metrics", {})
    else:
        new_brief = DailyBrief(
            user_id=user_id,
            date=today,
            summary_text=data.get("summary_text", ""),
            priorities=data.get("priorities", []),
            metrics=data.get("metrics", {})
        )
        db.add(new_brief)
        
    # Add Insights
    for ins in data.get("insights", []):
        db.add(UserInsight(
            user_id=user_id,
            insight_type=ins.get("type", "general"),
            insight_text=ins.get("text", "")
        ))
        
    db.commit()
    return data
