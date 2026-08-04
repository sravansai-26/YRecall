import logging
import resend
from datetime import datetime
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.core.config import settings
from app.modules.support.models import EmailLog, EmailStatus

logger = logging.getLogger(__name__)

# Initialize Resend
if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

def log_email_attempt(
    db: Session,
    to_email: str,
    subject: str,
    template_name: str,
    status: EmailStatus = EmailStatus.CREATED,
    message_id: str = None,
    error_message: str = None
):
    """Log email dispatch attempts and outcomes to the database."""
    if not db:
        return None
    try:
        log_entry = EmailLog(
            to_email=to_email,
            from_email=settings.FROM_EMAIL,
            subject=subject,
            template_name=template_name,
            status=status,
            message_id=message_id,
            error_message=error_message
        )
        db.add(log_entry)
        db.commit()
        return log_entry
    except Exception as e:
        logger.error(f"Failed to log email: {e}")
        db.rollback()
        return None


def get_base_html(content: str) -> str:
    """Provides a beautiful, branded HTML wrapper for all emails."""
    year = datetime.now().year
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{settings.APP_NAME}</title>
        <style>
            body {{
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #f6f8fa;
                margin: 0;
                padding: 0;
                color: #24292f;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }}
            .header {{
                background-color: #006e6e;
                padding: 30px 40px;
                text-align: left;
            }}
            .header h1 {{
                color: #ffffff;
                margin: 0;
                font-size: 24px;
                font-weight: 600;
                letter-spacing: -0.5px;
            }}
            .content {{
                padding: 40px;
                line-height: 1.6;
                font-size: 16px;
            }}
            .content h2 {{
                color: #006e6e;
                margin-top: 0;
                font-size: 20px;
            }}
            .footer {{
                background-color: #f8f9fa;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #eaecef;
                font-size: 13px;
                color: #6e7781;
            }}
            .button {{
                display: inline-block;
                background-color: #006e6e;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
            }}
            .meta-box {{
                background-color: #f6f8fa;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
                border: 1px solid #eaecef;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://raw.githubusercontent.com/sravansai-26/YRecall/main/04_Development/mobile/assets/logos/yr-logo.png" alt="YRecall Logo" width="36" height="36" style="vertical-align: middle; margin-right: 12px; background-color: #ffffff; border-radius: 50%; padding: 4px; border: none; outline: none;">
                <h1 style="display: inline-block; vertical-align: middle;">{settings.APP_NAME}</h1>
            </div>
            <div class="content">
                {content}
            </div>
            <div class="footer">
                <p>&copy; {year} {settings.COMPANY_NAME}. All rights reserved.</p>
                <p>If you have any questions, you can reply directly to this email or visit our <a href="{settings.APP_URL}/support" style="color: #006e6e;">Support Center</a>.</p>
            </div>
        </div>
    </body>
    </html>
    """

async def _send_email_core(db: Session, to_email: str, subject: str, html: str, template_name: str, reply_to: str = None) -> bool:
    """Core function to dispatch email via Resend and log it."""
    if not settings.RESEND_API_KEY:
        logger.warning(f"RESEND_API_KEY missing. Mock send to {to_email}: {subject}")
        log_email_attempt(db, to_email, subject, template_name, EmailStatus.DELIVERED, "mock-id-123")
        return True

    try:
        params = {
            "from": f"{settings.FROM_NAME} <{settings.FROM_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "html": html,
        }
        if reply_to:
            params["reply_to"] = reply_to
            
        response = resend.Emails.send(params)
        
        # Check if response has id (success)
        message_id = response.get('id') if isinstance(response, dict) else getattr(response, 'id', None)
        
        log_email_attempt(db, to_email, subject, template_name, EmailStatus.DELIVERED, message_id)
        
        # Explicitly print to console for the developer
        print(f"[SUCCESS] Email sent to: {to_email} | Subject: {subject} | Message ID: {message_id}")
        logger.info(f"Email successfully sent to {to_email}")
        
        return True
    except Exception as e:
        logger.error(f"Resend API Error: {str(e)}")
        print(f"[FAILED] Failed to send email to {to_email}: {str(e)}")
        log_email_attempt(db, to_email, subject, template_name, EmailStatus.FAILED, error_message=str(e))
        return False


# ====================================================
# REUSABLE EMAIL SERVICE METHODS
# ====================================================

async def send_email(db: Session, to_email: str, subject: str, html: str, template_name: str, reply_to: str = None) -> bool:
    """Public wrapper to dispatch a generic HTML email."""
    html_with_base = get_base_html(html) if "<html" not in html.lower() else html
    return await _send_email_core(db, to_email, subject, html_with_base, template_name, reply_to)

async def send_auto_reply(db: Session, to_email: str, name: str, ticket_id: str, subject: str):
    """Sends an automatic acknowledgement to the user for Support/Contact forms."""
    content = f"""
        <h2>We've received your request</h2>
        <p>Hi {name},</p>
        <p>Thank you for contacting {settings.APP_NAME} Support.</p>
        <p>We've successfully received your request regarding <strong>"{subject}"</strong>.</p>
        
        <div class="meta-box">
            <strong>Ticket ID:</strong> {ticket_id}<br>
            <strong>Status:</strong> In Review<br>
            <strong>Estimated Response:</strong> Within 24-48 hours
        </div>
        
        <p>You can reply directly to this email with any additional information or attachments that might help us resolve your inquiry faster.</p>
        <br>
        <p>Best regards,<br><strong>{settings.FROM_NAME}</strong></p>
    """
    html = get_base_html(content)
    return await _send_email_core(db, to_email, f"Received: {subject} [#{ticket_id}]", html, "support_auto_reply", settings.SUPPORT_EMAIL)

async def send_support_email_to_admin(db: Session, ticket_id: str, name: str, email: str, subject: str, message: str, meta: dict):
    """Forwards the user's contact request to the internal Support Email (e.g. Zendesk/Zoho)."""
    meta_html = "".join([f"<strong>{k}:</strong> {v}<br>" for k, v in meta.items()])
    content = f"""
        <h2>New Support Request: {subject}</h2>
        <div class="meta-box">
            <strong>Ticket ID:</strong> {ticket_id}<br>
            <strong>From:</strong> {name} ({email})<br>
            {meta_html}
        </div>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 6px;">{message}</p>
    """
    html = get_base_html(content)
    return await _send_email_core(db, settings.SUPPORT_EMAIL, f"New Ticket [#{ticket_id}]: {subject}", html, "admin_support_alert", reply_to=email)


async def send_bug_report_auto_reply(db: Session, to_email: str, bug_id: str, title: str):
    """Sends an automatic acknowledgement to the user for Bug reports."""
    content = f"""
        <h2>Bug Report Logged</h2>
        <p>Hi there,</p>
        <p>Thank you for helping us improve {settings.APP_NAME}. Your bug report has been securely logged with our engineering team.</p>
        
        <div class="meta-box">
            <strong>Bug ID:</strong> {bug_id}<br>
            <strong>Title:</strong> {title}
        </div>
        
        <p>If our team needs further details to reproduce the issue, we'll reach out to this email address.</p>
        <br>
        <p>Best regards,<br><strong>{settings.APP_NAME} Engineering</strong></p>
    """
    html = get_base_html(content)
    return await _send_email_core(db, to_email, f"Bug Logged: {title} [#{bug_id}]", html, "bug_auto_reply", settings.SUPPORT_EMAIL)

async def send_bug_report_to_admin(db: Session, bug_id: str, title: str, description: str, category: str, priority: str, meta: dict, user_email: str = None):
    """Forwards the bug report to the internal engineering/support email."""
    meta_html = "".join([f"<strong>{k}:</strong> {v}<br>" for k, v in meta.items()])
    content = f"""
        <h2>New Bug Report: {title}</h2>
        <div class="meta-box">
            <strong>Bug ID:</strong> {bug_id}<br>
            <strong>Category:</strong> {category}<br>
            <strong>Priority:</strong> <span style="color: {'#d73a49' if priority.lower() in ['high', 'critical'] else '#24292f'}">{priority.upper()}</span><br>
            {meta_html}
        </div>
        <h3>Description / Steps to Reproduce:</h3>
        <p style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 6px;">{description}</p>
    """
    html = get_base_html(content)
    reply_to = user_email if user_email else None
    return await _send_email_core(db, settings.SUPPORT_EMAIL, f"[{priority.upper()}] Bug [#{bug_id}]: {title}", html, "admin_bug_alert", reply_to=reply_to)


# ====================================================
# PLACEHOLDERS FOR FUTURE REUSABILITY
# ====================================================

async def send_welcome_email(db: Session, to_email: str, name: str):
    pass

async def send_notification_email(db: Session, to_email: str, subject: str, body: str):
    pass

async def send_export_ready_email(db: Session, to_email: str, download_link: str):
    pass

async def send_team_invitation(db: Session, to_email: str, inviter_name: str, workspace_name: str, invite_link: str):
    pass

async def send_account_deletion_confirmation(db: Session, to_email: str):
    pass
