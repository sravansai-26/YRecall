import json
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from google import genai

from ...core.config import settings
from ..users.models import User
from ..captures.models import Capture
from ..persona.prompt_builder import build_system_prompt
from .models import DailyBrief, UserInsight

client = genai.Client(api_key=settings.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

def generate_daily_brief(db: Session, user_id: str) -> dict:
    """
    Generates a personalized Daily Brief based on the user's Persona and recent memories.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
        
    today = datetime.now().date()
    yesterday = datetime.now() - timedelta(days=1)
    
    # Retrieve recent captures (last 48 hours for context)
    recent_captures = db.query(Capture).filter(
        Capture.user_id == user_id,
        Capture.deleted_at == None,
        Capture.created_at >= yesterday
    ).all()
    
    context_str = "\n".join([f"- {c.title}: {c.summary or c.content_text[:200]}" for c in recent_captures])
    if not context_str:
        context_str = "No recent memories captured."
        
    task_context = f"""
    Generate a personalized Daily Brief for the user for today.
    
    RECENT MEMORIES (Last 48 hours):
    {context_str}
    
    INSTRUCTIONS:
    1. Read the User Persona, Behaviors, and Goals (provided in the system prompt).
    2. Read the Recent Memories.
    3. Generate a highly personalized 'summary_text' (2-3 paragraphs) that speaks directly to the user's profession, goals, and recent activity. Address them warmly based on their preferences.
    4. Provide 2-3 personalized 'priorities' for the day.
    5. Generate 1-2 'insights' reflecting on their behavior or progress toward goals.
    
    Output strictly in JSON format:
    {{
        "summary_text": "Good morning! As a Founder... etc.",
        "priorities": ["Review Project X", "Read Y"],
        "insights": [
            {{"text": "You spent more time on backend architecture yesterday, aligning with your goals.", "type": "productivity"}}
        ],
        "metrics": {{"productivity_score": 85}}
    }}
    """
    
    prompt = build_system_prompt(db, user, task_context)
    
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    
    text = response.text
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
        
    data = json.loads(text)
    
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
            insight_text=ins.get("text", ""),
            relevance_score=0.9
        ))
        
    db.commit()
    return data
