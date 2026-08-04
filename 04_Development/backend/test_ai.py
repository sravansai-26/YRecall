import asyncio
import traceback
from app.main import app  # This forces all models and routers to load
from app.core.database import SessionLocal
from app.modules.users.models import User
from app.modules.ai.schemas import ChatRequest
from app.modules.ai.service import chat_with_rag

def test():
    db = SessionLocal()
    user = db.query(User).first()
    if not user:
        print("No user")
        return
        
    req = ChatRequest(message="Hello")
    try:
        conv, msg, citations = chat_with_rag(db, user, req)
        print("Success:", msg.content)
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    test()
