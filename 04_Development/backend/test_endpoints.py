import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_current_user
from app.modules.users.models import User
from app.core.database import SessionLocal
import json

def run_tests():
    # Setup a test user
    db = SessionLocal()
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            firebase_uid="test_uid_" + str(uuid.uuid4())[:8],
            email="test@example.com",
            display_name="Test User"
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

    def override_get_current_user():
        return test_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    client = TestClient(app)

    print("--- TESTING POST /api/v1/captures ---")
    req_body = {
        "content_text": "I just successfully configured my Alembic migrations on Supabase!",
        "type": "text"
    }
    print("Request Body:", json.dumps(req_body, indent=2))
    response = client.post("/api/v1/captures", json=req_body)
    print("Status:", response.status_code)
    print("Response JSON:\n", json.dumps(response.json(), indent=2))

    print("\n--- TESTING POST /api/v1/ai/chat ---")
    chat_req = {
        "message": "What did I just configure?"
    }
    print("Request Body:", json.dumps(chat_req, indent=2))
    response = client.post("/api/v1/ai/chat", json=chat_req)
    print("Status:", response.status_code)
    print("Response JSON:\n", json.dumps(response.json(), indent=2))
    
    db.close()

if __name__ == "__main__":
    run_tests()
