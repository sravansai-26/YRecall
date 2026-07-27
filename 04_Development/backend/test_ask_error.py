from app.core.database import SessionLocal
from app.modules.users.models import User
from app.modules.ai.schemas import ChatRequest
from app.modules.ai.service import chat_with_rag

db = SessionLocal()
user = db.query(User).first()
req = ChatRequest(message="hello")

try:
    chat_with_rag(db, user, req)
except Exception as e:
    import traceback
    traceback.print_exc()
