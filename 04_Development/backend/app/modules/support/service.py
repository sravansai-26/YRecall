import logging
import random
import string
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from uuid import UUID

from .models import SupportTicket, BugReport, SupportStatus
from .schemas import ContactRequest, BugReportRequest
from app.core.config import settings
from app.core.email import send_auto_reply, send_support_email_to_admin, send_bug_report_auto_reply, send_bug_report_to_admin

logger = logging.getLogger(__name__)


def generate_ticket_id(prefix: str = "YR") -> str:
    """Generates a ticket ID like YR-20260801-10321"""
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.digits, k=5))
    return f"{prefix}-{date_str}-{random_str}"


async def create_support_ticket(db: Session, user_id: UUID, ticket_in: ContactRequest) -> SupportTicket:
    ticket_id = generate_ticket_id()
    
    ticket = SupportTicket(
        ticket_id=ticket_id,
        user_id=user_id,
        name=ticket_in.name,
        email=ticket_in.email,
        subject=ticket_in.subject,
        message=ticket_in.message,
        attachments=ticket_in.attachments,
        status=SupportStatus.OPEN
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    # Fire and forget emails (awaiting them so they complete before return for now, in prod you'd use BackgroundTasks)
    await send_auto_reply(
        db=db, 
        to_email=ticket_in.email, 
        name=ticket_in.name, 
        ticket_id=ticket_id, 
        subject=ticket_in.subject
    )
    
    meta = {
        "Status": "OPEN"
    }
    await send_support_email_to_admin(
        db=db,
        ticket_id=ticket_id,
        name=ticket_in.name,
        email=ticket_in.email,
        subject=ticket_in.subject,
        message=ticket_in.message,
        meta=meta
    )
    
    return ticket


async def create_bug_report(db: Session, user_id: UUID, bug_in: BugReportRequest, user_email: str = None) -> BugReport:
    bug_id = generate_ticket_id("BUG")
    
    bug = BugReport(
        bug_id=bug_id,
        user_id=user_id,
        title=bug_in.title,
        description=bug_in.description,
        category=bug_in.category,
        priority=bug_in.priority,
        device_info=bug_in.device_info,
        logs=bug_in.logs,
        screenshot_url=bug_in.screenshot_url,
        status=SupportStatus.OPEN
    )
    db.add(bug)
    db.commit()
    db.refresh(bug)
    
    # Send emails
    if user_email:
        await send_bug_report_auto_reply(
            db=db,
            to_email=user_email,
            bug_id=bug_id,
            title=bug_in.title
        )
        
    meta = {
        "User Email": user_email or "Anonymous",
        "Device": bug_in.device_info.get("modelName", "Unknown"),
        "OS": f"{bug_in.device_info.get('osName', 'Unknown')} {bug_in.device_info.get('osVersion', '')}",
        "App Version": bug_in.device_info.get("appVersion", "Unknown")
    }
    
    await send_bug_report_to_admin(
        db=db,
        bug_id=bug_id,
        title=bug_in.title,
        description=bug_in.description,
        category=bug_in.category,
        priority=bug_in.priority,
        meta=meta,
        user_email=user_email
    )
    
    return bug

def get_user_tickets(db: Session, user_id: UUID):
    return db.query(SupportTicket).filter(SupportTicket.user_id == user_id).order_by(SupportTicket.created_at.desc()).all()

def get_faqs():
    return [
        {"id": "faq-1", "category": "Accounts", "question": "How secure is my personal recall data?", "answer": "We use end-to-end encryption for all synced data. Your 'Mind' is stored locally by default, only syncing to our secure nodes if you explicitly enable Proactive AI services."},
        {"id": "faq-2", "category": "Privacy", "question": "Can I export my Knowledge Graph to other apps?", "answer": "Yes, YRecall supports standard JSON and Markdown exports. Visit Settings > Data Privacy to initiate a full archive export at any time."},
        {"id": "faq-3", "category": "Timeline", "question": "What is the difference between Timeline and History?", "answer": "History is a raw log of inputs, while Timeline uses AI to synthesize events into meaningful contexts and narratives about your daily life."},
        {"id": "faq-4", "category": "AI", "question": "How does the AI persona work?", "answer": "The AI learns your preferences and context over time to provide proactive suggestions and conversational recall."}
    ]

def get_resources():
    return [
        {"title": "Documentation", "url": "https://docs.buildwithsravan.dev"},
        {"title": "Release Notes", "url": "https://changelog.buildwithsravan.dev"},
        {"title": "Privacy Policy", "url": "https://buildwithsravan.dev/privacy"},
        {"title": "Terms of Service", "url": "https://buildwithsravan.dev/terms"},
        {"title": "Licenses", "url": "https://buildwithsravan.dev/licenses"},
    ]

def get_system_status():
    return {
        "status": "operational",
        "message": "All systems are functioning normally.",
        "incidents": []
    }
