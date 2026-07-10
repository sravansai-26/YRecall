import time
from fastapi import HTTPException, status, Request, Depends
from typing import Callable, Dict, List
from .security import get_current_user
from ..modules.users.models import User

# In-memory store for rate limiting: { "user_id:path": [timestamp1, timestamp2, ...] }
_rate_limit_store: Dict[str, List[float]] = {}

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    def __call__(self, request: Request, current_user: User = Depends(get_current_user)):
        user_id = str(current_user.id)
        path = request.url.path
        key = f"{user_id}:{path}"
        
        now = time.time()
        
        if key not in _rate_limit_store:
            _rate_limit_store[key] = []
            
        # Clean up old timestamps
        _rate_limit_store[key] = [t for t in _rate_limit_store[key] if now - t < self.window_seconds]
        
        if len(_rate_limit_store[key]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again later. (Limit: {self.max_requests} requests per {self.window_seconds}s)"
            )
            
        _rate_limit_store[key].append(now)
        return current_user
