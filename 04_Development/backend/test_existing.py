import uuid
import json
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_current_user
from app.modules.users.models import User
from app.core.database import SessionLocal

def run_tests():
    db = SessionLocal()
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    app.dependency_overrides[get_current_user] = lambda: test_user
    client = TestClient(app)

    print("\n--- CREATING NEW CONV ---")
    chat_req = {"message": "Hello AI"}
    response = client.post("/api/v1/ai/chat", json=chat_req)
    print("Status:", response.status_code)
    chat_json = response.json()
    conv_id = chat_json["data"]["conversation_id"]

    print(f"\n--- TESTING POST TO EXISTING CONV {conv_id} ---")
    chat_req2 = {"message": "What did I just say?", "conversation_id": conv_id}
    response2 = client.post("/api/v1/ai/chat", json=chat_req2)
    print("Status:", response2.status_code)
    print(response2.text)

    db.close()

if __name__ == "__main__":
    run_tests()
