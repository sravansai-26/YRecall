import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.modules.support.service import create_support_ticket
from app.modules.support.schemas import ContactRequest

async def test_email_zoho():
    db = SessionLocal()
    import app.main
    try:
        contact_req = ContactRequest(
            name="Real Test User",
            email="sai1234comon@gmail.com",
            subject="Testing Zoho Inbox Delivery",
            message="This is a test message to see if Zoho receives the email from Resend. The button color issue will also be fixed."
        )
        ticket = await create_support_ticket(db, None, contact_req)
        print(f"Success! Created ticket: {ticket.ticket_id}")
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_email_zoho())
