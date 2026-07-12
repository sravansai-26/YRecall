import requests
import json
import time

API_URL = "http://127.0.0.1:8000/api/v1"
# We need a user token. In development we can just create a test user or fetch one if auth is disabled.
# Wait, captures endpoint requires Auth token. Let's find a token or just test via the python shell.

import sys
import os

# Add backend to path
sys.path.append(r"C:\Users\Sravan\Projects\YRecall\04_Development\backend")
from app.core.database import SessionLocal
from app.modules.users.models import User
from app.modules.captures.schemas import CaptureCreateText
from app.modules.captures.service import create_text_capture
from fastapi import BackgroundTasks

def test_automation():
    db = SessionLocal()
    user = db.query(User).first()
    if not user:
        print("No user found")
        return
        
    print(f"Testing for user: {user.id}")
    
    # Create capture
    capture_in = CaptureCreateText(
        title="Schedule meeting with team",
        content_text="I need to remind myself to schedule a meeting with the design team tomorrow at 10 AM to discuss the new automation features.",
        source="manual"
    )
    
    bg_tasks = BackgroundTasks()
    capture = create_text_capture(db, user, capture_in, bg_tasks)
    
    print(f"Capture created: {capture.id}")
    
    # Manually run the bg tasks
    print("Running background tasks...")
    import asyncio
    
    async def run_tasks():
        for task in bg_tasks.tasks:
            if asyncio.iscoroutinefunction(task.func):
                await task.func(*task.args, **task.kwargs)
            else:
                task.func(*task.args, **task.kwargs)
                
    asyncio.run(run_tasks())
    
    print("Background tasks completed. Checking for reminders...")
    
    from app.modules.automation.models import Reminder
    reminders = db.query(Reminder).filter(Reminder.source_capture_id == capture.id).all()
    
    if not reminders:
        print("No reminders created.")
    else:
        for r in reminders:
            print(f"Reminder created! Title: {r.title}, Due: {r.due_date}, Priority: {r.priority}")
            
    from app.modules.captures.models import Capture
    timeline = db.query(Capture).filter(Capture.type == "automation").order_by(Capture.created_at.desc()).first()
    if timeline:
        print(f"Timeline event created! Title: {timeline.title}, Content: {timeline.content_text}")

if __name__ == "__main__":
    test_automation()
