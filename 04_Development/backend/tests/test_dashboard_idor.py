from fastapi.testclient import TestClient
import uuid
import sys
import os
from unittest.mock import patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import sqlalchemy.dialects.postgresql
from sqlalchemy.types import JSON
sqlalchemy.dialects.postgresql.JSONB = JSON

from app.main import app
from app.core.database import Base, engine, get_db
from sqlalchemy.orm import sessionmaker

from app.modules.users.models import User
from app.modules.collaboration.models import Workspace, WorkspaceMember, WorkspaceRole

# Create an in-memory SQLite DB
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_dashboard_idor():
    db = TestingSessionLocal()
    user_a = User(id=uuid.uuid4(), email="usera@test.com", firebase_uid="usera")
    user_b = User(id=uuid.uuid4(), email="userb@test.com", firebase_uid="userb")
    db.add_all([user_a, user_b])
    
    workspace_b = Workspace(id=uuid.uuid4(), name="Workspace B")
    db.add(workspace_b)
    
    wm_b = WorkspaceMember(workspace_id=workspace_b.id, user_id=user_b.id, role=WorkspaceRole.OWNER)
    db.add(wm_b)
    
    db.commit()
    db.refresh(user_a)
    db.refresh(user_b)
    db.refresh(workspace_b)
    
    # Mock the dashboard limiter to return the appropriate user
    from app.modules.home.controller import dashboard_limiter
    
    # We will patch `get_dashboard_data` to return empty data so we don't have to seed captures
    with patch("app.modules.home.controller.get_dashboard_data") as mock_get_data:
        mock_get_data.return_value = {"highlights": [], "continue_items": []}
        
        # Test 1: User B (Owner) can access Workspace B
        app.dependency_overrides[dashboard_limiter] = lambda: user_b
        
        res_b = client.get(f"/api/v1/home/dashboard?workspace_id={str(workspace_b.id)}")
        assert res_b.status_code == 200, f"Expected 200, got {res_b.status_code}"
        print("Test 1 Passed: Workspace member can access data.")
        
        # Test 2: User A (Not a member) CANNOT access Workspace B
        app.dependency_overrides[dashboard_limiter] = lambda: user_a
        
        res_a = client.get(f"/api/v1/home/dashboard?workspace_id={str(workspace_b.id)}")
        assert res_a.status_code == 403, f"Expected 403, got {res_a.status_code}"
        print("Test 2 Passed: Non-member is blocked (IDOR fixed).")
        
        # Test 3: User A can access their own personal dashboard (no workspace_id)
        app.dependency_overrides[dashboard_limiter] = lambda: user_a
        res_a_personal = client.get("/api/v1/home/dashboard")
        assert res_a_personal.status_code == 200, f"Expected 200, got {res_a_personal.status_code}"
        print("Test 3 Passed: Personal dashboard works.")
        
        print("ALL DASHBOARD TESTS PASSED.")

if __name__ == "__main__":
    test_dashboard_idor()
