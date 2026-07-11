import json
from sqlalchemy.orm import Session
from google import genai
from .service import create_notification
from ...core.config import settings
from ..captures.models import Capture

client = genai.Client(api_key=settings.GEMINI_API_KEY)
# We use a fast, stable model for background generation
MODEL_NAME = "gemini-flash-lite-latest" 

def evaluate_capture_for_notifications(db: Session, capture_id: str, user_id: str):
    """
    Evaluates a new or updated capture to generate smart notifications/reminders.
    Designed to run as a background task.
    """
    capture = db.query(Capture).filter(Capture.id == capture_id, Capture.user_id == user_id).first()
    if not capture:
        return
    
    # If the capture has no text/summary, skip
    content_to_analyze = capture.summary or capture.content_text or capture.transcript or capture.ocr_text
    if not content_to_analyze:
        return

    # Check for recent identical notifications to prevent spam
    # (Simple check: we don't spam if a similar notification was created in the last day, but let's rely on LLM for now)

    prompt = f"""
    You are the Proactive Intelligence Engine for an AI Second Brain.
    A user just saved the following memory:
    
    Title: {capture.title}
    Type: {capture.type}
    Content: {content_to_analyze}
    
    Evaluate this memory and decide if the user needs a proactive notification. 
    Types of valid notifications:
    1. 'reminder': E.g., "Submit assignment tomorrow", "Call mom at 5PM".
    2. 'suggestion': E.g., "Continue reading your project notes?", "Add this to your upcoming trip?".
    3. 'insight': E.g., "You've been studying MongoDB for 3 days."
    
    If no notification is needed, return an empty array for 'notifications'.
    Do NOT create generic notifications like "Memory saved". Only create HIGH VALUE, actionable notifications.
    
    Output JSON exactly in this format:
    {{
        "notifications": [
            {{
                "title": "Actionable Title",
                "content": "Description of why this matters",
                "type": "reminder",
                "is_critical": false,
                "action_type": "open_capture"
            }}
        ]
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
        
        for notif_data in data.get("notifications", []):
            create_notification(
                db=db,
                user_id=user_id,
                title=notif_data.get("title"),
                content=notif_data.get("content"),
                type=notif_data.get("type", "insight"),
                is_critical=notif_data.get("is_critical", False),
                related_capture_id=capture.id,
                action_type=notif_data.get("action_type", "open_capture")
            )
    except Exception as e:
        print(f"Failed to generate intelligence notifications for {capture_id}: {e}")
