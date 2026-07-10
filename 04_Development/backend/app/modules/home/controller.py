from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from typing import Dict, Any

from ...core.database import get_db
from ...core.security import get_current_user
from ...core.rate_limit import RateLimiter
from ..users.models import User
from .service import get_dashboard_data, get_analytics_data

router = APIRouter()

# Rate limiters
dashboard_limiter = RateLimiter(max_requests=30, window_seconds=60)
refresh_limiter = RateLimiter(max_requests=3, window_seconds=86400) # 3 per day

@router.get("/dashboard")
def get_dashboard(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(dashboard_limiter)
):
    """Fetches the aggregated dashboard state."""
    data = get_dashboard_data(db, str(current_user.id))
    return {"success": True, "data": data}

@router.get("/analytics")
def get_analytics(
    request: Request,
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetches time-series data for the charts."""
    data = get_analytics_data(db, str(current_user.id), days)
    return {"success": True, "data": data}

@router.post("/daily/refresh")
def refresh_daily_brief(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(refresh_limiter)
):
    """Forces regeneration of the daily brief."""
    # In a real scenario, this calls ai/reflection_service
    # For now we'll trigger a background task or do it synchronously if fast enough.
    # We will implement the integration in ai module.
    
    # Placeholder: we'd call generate_daily_brief(db, current_user.id)
    return {"success": True, "message": "Daily brief refresh initiated"}
