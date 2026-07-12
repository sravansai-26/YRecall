import json
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
from typing import List, Optional
from google import genai
from ...core.config import settings
from .models import Reminder, AutomationSuggestion
from ..captures.models import Capture
from ..users.models import User
from ..persona.prompt_builder import build_system_prompt

client = genai.Client(api_key=settings.GEMINI_API_KEY)
# We need structured output, gemini-2.5-flash is good for this
MODEL_NAME = "gemini-2.5-flash"

def analyze_capture_intent(db: Session, capture_id: str, user_id: str):
    """
    Analyzes a newly processed capture to determine if it contains an actionable intent.
    If so, it triggers the Action Executor or creates suggestions.
    """
    capture = db.query(Capture).filter(Capture.id == capture_id, Capture.user_id == user_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not capture or not user:
        return
        
    text_content = capture.content_text or capture.ocr_text or capture.transcript or capture.summary or capture.title
    if not text_content:
        return
        
    system_instructions = f"""You are an Intent Detection Engine for an AI operating system.
    Analyze the following captured text and determine if it implies actionable items.
    Types of actions:
    - 'create_reminder': The user needs to be reminded of something at a specific time or just added to a todo list.
    - 'create_task': The user needs to accomplish a specific multi-step task.
    - 'create_workflow': The user is describing a repeatable sequence of events (e.g. "Every morning do X").
    
    If you detect actionable items, extract them into a structured JSON array.
    If no actionable intent is detected, return an empty array.
    
    The current date and time is {datetime.utcnow().isoformat()}. Use this to parse relative times like "tomorrow" or "next week".
    
    Output strictly valid JSON matching this schema:
    {{
        "intents": [
            {{
                "action_type": "create_reminder",
                "title": "Buy milk",
                "description": "At the grocery store",
                "priority": "medium",
                "due_date": "2026-07-12T10:00:00Z", // Use ISO format if a time is detected, or null
                "confidence": 0.95,
                "reasoning": "The user explicitly mentioned needing to buy milk."
            }}
        ]
    }}
    """
    
    prompt = build_system_prompt(db, user, system_instructions)
    
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[prompt, f"CAPTURE TEXT: {text_content}"]
        )
        
        raw_text = response.text
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            
        data = json.loads(raw_text)
        intents = data.get("intents", [])
        
        from .action_executor import execute_intent
        
        for intent in intents:
            execute_intent(db, user_id, capture_id, intent)
            
    except Exception as e:
        print(f"Failed to analyze capture intent: {e}")
