import json
from sqlalchemy.orm import Session
from uuid import UUID
from google import genai
from .models import UserBehavior
from ..users.models import User
from ...core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

def update_behavior_from_capture(db: Session, user_id: str, capture_type: str, title: str):
    """
    Called in background after a capture is created to incrementally update the user's behavioral profile.
    """
    user = db.query(User).filter(User.id == user_id).first()
    behavior = db.query(UserBehavior).filter(UserBehavior.user_id == user_id).first()
    
    if not behavior:
        behavior = UserBehavior(user_id=user_id, data={})
        db.add(behavior)
        
    # We use LLM to decide if this capture changes any behavioral patterns.
    # In a fully scaled system, we'd batch this nightly. For real-time, we do a quick check.
    
    current_data_str = json.dumps(behavior.data)
    
    prompt = f"""
    You are analyzing the behavior of user {user.display_name}.
    Current observed behaviors: {current_data_str}
    
    The user just captured a new memory:
    Type: {capture_type}
    Title: {title}
    
    Does this reveal any new behavioral pattern? 
    (e.g., "Captures a lot of code snippets", "Frequently saves articles at night", "Interested in Startup Planning").
    
    If it reinforces a pattern or creates a new one, output the UPDATED behaviors JSON object.
    If this is too trivial to update behaviors, output exactly: {{"data": {current_data_str}}}
    
    Respond STRICTLY in JSON:
    {{
        "data": {{
            "frequent_capture_type": "text",
            "primary_interest": "software architecture",
            "habit": "saves bookmarks"
        }}
    }}
    """
    
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
            
        data = json.loads(text)
        if "data" in data:
            behavior.data = data["data"]
            db.commit()
    except Exception as e:
        print(f"Failed to update behavior: {e}")
