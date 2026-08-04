from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.modules.users.models import User
import json

client = TestClient(app)

def test():
    db = SessionLocal()
    user = db.query(User).first()
    
    # We must override the get_current_user dependency to bypass auth
    from app.core.security import get_current_user
    app.dependency_overrides[get_current_user] = lambda: user
    
    # Try creating a new conversation
    resp = client.post("/api/v1/ai/chat", json={
        "message": "First message"
    })
    print("First call:", resp.status_code)
    if resp.status_code != 200:
        print(resp.json())
        return
        
    conv_id = resp.json()["data"]["conversation_id"]
    
    # Try second message in same conversation
    resp2 = client.post("/api/v1/ai/chat", json={
        "conversation_id": conv_id,
        "message": "Second message"
    })
    print("Second call:", resp2.status_code)
    if resp2.status_code != 200:
        print(resp2.json())
        
if __name__ == "__main__":
    test()
