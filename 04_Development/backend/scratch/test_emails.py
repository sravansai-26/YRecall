import asyncio
import os
import sys

# Ensure backend folder is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
import app.main # This ensures all SQLAlchemy mappers and models are loaded
from app.modules.support.service import create_support_ticket, create_bug_report
from app.modules.support.schemas import ContactRequest, BugReportRequest
import uuid

async def test_email_functions():
    db = SessionLocal()
    try:
        user_id = None
        
        print("Testing Contact Support Email...")
        contact_req = ContactRequest(
            name="Test User",
            email="testuser@example.com",
            subject="Need help with Timeline",
            message="Hi there, I am having trouble understanding how the Timeline AI summary works. Can you please explain?"
        )
        ticket = await create_support_ticket(db, user_id, contact_req)
        print(f"Success! Created ticket: {ticket.ticket_id}")

        print("\nTesting Bug Report Email...")
        bug_req = BugReportRequest(
            title="App crashes when opening Knowledge Graph",
            description="When I tap on the Knowledge Graph icon, the app immediately closes. I am using an iPhone 14.",
            category="Crash",
            priority="high",
            device_info={"modelName": "iPhone 14", "osName": "iOS", "osVersion": "17.1.1", "appVersion": "1.0.0"}
        )
        bug = await create_bug_report(db, user_id, bug_req, user_email="testuser@example.com")
        print(f"Success! Created bug: {bug.bug_id}")
        
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_email_functions())
