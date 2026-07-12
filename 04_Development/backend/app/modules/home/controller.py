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
    workspace_id: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dashboard_limiter)
):
    """Fetches the aggregated dashboard state."""
    data = get_dashboard_data(db, str(current_user.id), workspace_id)
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
    from .intelligence import generate_daily_brief
    try:
        data = generate_daily_brief(db, str(current_user.id))
        return {"success": True, "message": "Daily brief generated successfully", "data": data}
    except Exception as e:
        return {"success": False, "message": str(e)}
