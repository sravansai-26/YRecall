import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import BackgroundTasks
import logging
from ...core.config import settings

logger = logging.getLogger(__name__)

def send_email_sync(to_email: str, subject: str, html_content: str):
    """
    Synchronously send an email using the SMTP settings configured in .env.
    This should be called within a background task to prevent blocking the API.
    """
    # If SMTP_PASSWORD is not set, log and skip (prevents crash on dev machines without creds)
    if not settings.SMTP_PASSWORD:
        logger.warning(f"SMTP_PASSWORD not set. Skipping email to {to_email} with subject '{subject}'.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email

    # Attach HTML content
    part = MIMEText(html_content, "html")
    msg.attach(part)

    try:
        if settings.SMTP_PORT == 465:
            # SSL
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
        else:
            # TLS
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
        server.quit()
        logger.info(f"Successfully sent email to {to_email}: '{subject}'")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")

def send_email_background(background_tasks: BackgroundTasks, to_email: str, subject: str, html_content: str):
    """
    Queue an email to be sent in the background.
    """
    if background_tasks:
        background_tasks.add_task(send_email_sync, to_email, subject, html_content)
    else:
        # Fallback if no background_tasks provided, though usually discouraged
        send_email_sync(to_email, subject, html_content)

def generate_notification_email_html(title: str, message: str, action_type: str = None) -> str:
    """
    Generates a beautiful HTML email template for YRecall notifications.
    """
    # Fallback/dynamic color schemes can be added. This uses a clean modern aesthetic matching YRecall.
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF3EB; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }}
            .header {{ background-color: #613A28; padding: 32px 40px; text-align: center; }}
            .header h1 {{ margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }}
            .content {{ padding: 40px; color: #4B4540; }}
            .title {{ font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px; color: #201A17; }}
            .message {{ font-size: 16px; line-height: 1.6; margin-bottom: 24px; }}
            .footer {{ background-color: #F5EFEB; padding: 24px 40px; text-align: center; color: #84746B; font-size: 14px; }}
            .button-container {{ text-align: left; margin-top: 32px; }}
            .button {{ display: inline-block; background-color: #613A28; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>YRecall</h1>
            </div>
            <div class="content">
                <h2 class="title">{title}</h2>
                <div class="message">
                    {message.replace(chr(10), '<br>')}
                </div>
                """
    if action_type == 'open_app':
        html += """
                <div class="button-container">
                    <a href="yrecall://" class="button">Open YRecall</a>
                </div>
        """
    html += """
            </div>
            <div class="footer">
                <p>This is an automated message from your YRecall Intelligence Engine.</p>
                <p>&copy; YRecall. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html
