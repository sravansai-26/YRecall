from app.core.security import generate_signed_url_token, verify_signed_url_token
from app.core.config import settings
import time
import uuid

def test_generate_and_verify_signed_url():
    capture_id = str(uuid.uuid4())
    
    # 1. Valid Token
    token = generate_signed_url_token(capture_id, expires_in=3600)
    assert verify_signed_url_token(capture_id, token) is True
    print("Test 1 passed")
    
    # 2. Invalid Token (wrong capture ID)
    other_id = str(uuid.uuid4())
    assert verify_signed_url_token(other_id, token) is False
    print("Test 2 passed")
    
    # 3. Invalid Token (expired)
    expired_token = generate_signed_url_token(capture_id, expires_in=-10)
    assert verify_signed_url_token(capture_id, expired_token) is False
    print("Test 3 passed")
    
    # 4. Tampered signature
    parts = token.split(":")
    tampered_token = f"{parts[0]}:{parts[1]}:tampered_{parts[2]}"
    assert verify_signed_url_token(capture_id, tampered_token) is False
    print("Test 4 passed")

    # 5. Missing parts
    assert verify_signed_url_token(capture_id, "invalid_string_no_colons") is False
    print("Test 5 passed")
    
    print("ALL TESTS PASSED")

if __name__ == "__main__":
    test_generate_and_verify_signed_url()
