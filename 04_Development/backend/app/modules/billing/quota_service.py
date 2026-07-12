from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
import calendar

from .models import BillingUsage

def _get_or_create_usage(db: Session, user_id: UUID) -> BillingUsage:
    usage = db.query(BillingUsage).filter(BillingUsage.user_id == user_id).first()
    if not usage:
        usage = BillingUsage(user_id=user_id)
        db.add(usage)
        db.commit()
        db.refresh(usage)
    else:
        # Check if period needs reset (monthly)
        now = datetime.now(timezone.utc)
        if usage.period_start.month != now.month or usage.period_start.year != now.year:
            # Reset monthly quotas
            usage.ai_requests_count = 0
            usage.captures_count = 0
            # Note: workspaces_count and storage_used_bytes are absolute, not monthly
            usage.period_start = now
            db.commit()
            db.refresh(usage)
            
    return usage

def increment_ai_requests(db: Session, user_id: UUID, count: int = 1) -> None:
    usage = _get_or_create_usage(db, user_id)
    usage.ai_requests_count += count
    db.commit()

def increment_captures(db: Session, user_id: UUID, count: int = 1) -> None:
    usage = _get_or_create_usage(db, user_id)
    usage.captures_count += count
    db.commit()

def update_workspaces_count(db: Session, user_id: UUID, count: int) -> None:
    usage = _get_or_create_usage(db, user_id)
    usage.workspaces_count = count
    db.commit()

def add_storage(db: Session, user_id: UUID, bytes_added: int) -> None:
    usage = _get_or_create_usage(db, user_id)
    usage.storage_used_bytes += bytes_added
    db.commit()

def remove_storage(db: Session, user_id: UUID, bytes_removed: int) -> None:
    usage = _get_or_create_usage(db, user_id)
    usage.storage_used_bytes = max(0, usage.storage_used_bytes - bytes_removed)
    db.commit()

def get_usage(db: Session, user_id: UUID) -> BillingUsage:
    return _get_or_create_usage(db, user_id)
