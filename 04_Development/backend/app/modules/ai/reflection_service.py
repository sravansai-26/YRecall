from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from google import genai
import json

from ...core.config import settings
from ..captures.models import Capture
from ..home.models import DailyBrief, UserInsight

client = genai.Client(api_key=settings.GEMINI_API_KEY)
# Requirement: Use Gemini 2.5 Flash
MODEL_NAME = "gemini-2.5-flash"

def generate_reflection(db: Session, user_id: str, timeframe: str) -> dict:
    """Generates an AI reflection based on captures from the given timeframe."""
    
    days = 1 if timeframe == "daily" else 7 if timeframe == "weekly" else 30
    start_date = datetime.now() - timedelta(days=days)
    
    captures = db.query(Capture).filter(
        Capture.user_id == user_id,
        Capture.created_at >= start_date,
        Capture.deleted_at == None
    ).all()
    
    if not captures:
        return {"summary": "Not enough captures in this timeframe to generate a reflection.", "insights": []}
    
    # Construct context
    context_lines = []
    for c in captures:
        context_lines.append(f"- [{c.type}] {c.title or 'Untitled'} (Created: {c.created_at})")
        if c.summary:
            context_lines.append(f"  Summary: {c.summary}")
            
    prompt = f"""
    You are an AI Second Brain assistant. Analyze the user's captures over the past {timeframe} and provide a reflection.
    
    Format the output strictly as JSON with this structure:
    {{
      "summary": "A cohesive paragraph reflecting on their activity.",
      "achievements": ["achievement 1", "achievement 2"],
      "insights": ["pattern insight 1", "productivity insight 2"]
    }}
    
    Captures:
    {chr(10).join(context_lines)}
    """
    
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        
        # Parse JSON
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        
        parsed = json.loads(text)
        
        # Save insights
        if parsed.get("insights"):
            for ins in parsed["insights"]:
                insight_model = UserInsight(
                    user_id=user_id,
                    insight_text=ins,
                    insight_type="pattern"
                )
                db.add(insight_model)
                
        # Save Daily Brief if daily
        if timeframe == "daily" and parsed.get("summary"):
            # Check if one already exists for today to overwrite or just create new
            today = datetime.now().date()
            existing_brief = db.query(DailyBrief).filter(
                DailyBrief.user_id == user_id,
                DailyBrief.date == today
            ).first()
            
            if existing_brief:
                existing_brief.summary_text = parsed["summary"]
                existing_brief.metrics = {"achievements": parsed.get("achievements", [])}
            else:
                new_brief = DailyBrief(
                    user_id=user_id,
                    date=today,
                    summary_text=parsed["summary"],
                    metrics={"achievements": parsed.get("achievements", [])},
                    priorities=[]
                )
                db.add(new_brief)

        db.commit()
            
        return parsed
    except Exception as e:
        print(f"Failed to generate reflection: {str(e)}")
        return {
            "summary": "Reflection generation is currently unavailable. Please try again later.",
            "insights": [],
            "achievements": []
        }
