import os
import sys
from dotenv import load_dotenv

# Load env before importing app
load_dotenv(".env")

import time
import uuid
import threading
from sqlalchemy import text
from concurrent.futures import ThreadPoolExecutor

from app.core.database import SessionLocal, engine
from app.modules.users.models import User
from app.modules.captures.models import Capture
from app.modules.captures.tasks import generate_and_store_embedding

# We'll run a quick DB pool stress test
def db_task(i):
    db = SessionLocal()
    try:
        # Create a user or fetch
        firebase_uid = f"stress_test_user_{uuid.uuid4().hex[:8]}"
        user = User(
            firebase_uid=firebase_uid,
            email=f"stress_{firebase_uid}@example.com",
            display_name=f"User {firebase_uid}"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create a capture
        capture = Capture(
            user_id=user.id,
            type="text",
            content_text=f"This is a stress test capture {i} for embedding generation.",
            status="completed"
        )
        db.add(capture)
        db.commit()
        db.refresh(capture)
        
        # Test embedding generation
        # We will only do this for the first few to avoid hitting rate limits
        if i < 5:
            generate_and_store_embedding(db, capture.id, capture.content_text)
            
        return True
    except Exception as e:
        print(f"Task {i} failed: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting stress test with 100 concurrent DB operations...")
    success_count = 0
    fail_count = 0
    
    start_time = time.time()
    
    # Run 100 concurrent tasks
    with ThreadPoolExecutor(max_workers=20) as executor:
        results = list(executor.map(db_task, range(100)))
        
    for r in results:
        if r:
            success_count += 1
        else:
            fail_count += 1
            
    print(f"Stress test completed in {time.time() - start_time:.2f} seconds.")
    print(f"Success: {success_count}, Failed: {fail_count}")
    
    # Check if there are any lingering connections causing OperationalError
    print("Verifying connection pool state...")
    try:
        db = SessionLocal()
        res = db.execute(text("SELECT 1")).scalar()
        print(f"Final DB ping: {'OK' if res == 1 else 'FAIL'}")
    except Exception as e:
        print(f"Final DB ping failed: {e}")
    finally:
        db.close()
