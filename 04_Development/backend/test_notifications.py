from app.core.database import SessionLocal
from app.modules.users.models import User
from app.modules.notifications.service import create_notification, get_notification_settings

db = SessionLocal()
user = db.query(User).first()

if user:
    settings = get_notification_settings(db, user)
    print("Initial Settings:", settings.categories)
    
    # Test creation
    notif = create_notification(db, str(user.id), "Test Notify", "Testing 123", type="system", category="System")
    print("Created:", notif.title if notif else "Suppressed by rules")
