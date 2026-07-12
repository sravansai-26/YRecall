from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from typing import List, Optional

from .models import Subscription, SubscriptionPlan
from . import schemas

def get_all_plans(db: Session) -> List[SubscriptionPlan]:
    return db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()

def get_plan(db: Session, plan_id: str) -> Optional[SubscriptionPlan]:
    return db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()

def get_user_subscription(db: Session, user_id: UUID) -> Optional[Subscription]:
    return db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()

def create_or_update_subscription(
    db: Session,
    user_id: UUID,
    plan_id: str,
    provider: str,
    provider_subscription_id: str,
    provider_customer_id: Optional[str] = None,
    status: str = "active",
    current_period_start: Optional[datetime] = None,
    current_period_end: Optional[datetime] = None
) -> Subscription:
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    
    if not sub:
        sub = Subscription(user_id=user_id)
        db.add(sub)
        
    sub.plan_id = plan_id
    sub.provider = provider
    sub.provider_subscription_id = provider_subscription_id
    if provider_customer_id:
        sub.provider_customer_id = provider_customer_id
    sub.status = status
    if current_period_start:
        sub.current_period_start = current_period_start
    if current_period_end:
        sub.current_period_end = current_period_end
        
    db.commit()
    db.refresh(sub)
    return sub

def cancel_subscription(db: Session, user_id: UUID, cancel_at_period_end: bool = True) -> Optional[Subscription]:
    sub = get_user_subscription(db, user_id)
    if not sub:
        return None
        
    sub.cancel_at_period_end = cancel_at_period_end
    if not cancel_at_period_end:
        sub.status = "canceled"
        sub.canceled_at = datetime.now(timezone.utc)
        
    db.commit()
    db.refresh(sub)
    return sub

def seed_default_plans(db: Session):
    # Free
    if not db.query(SubscriptionPlan).filter(SubscriptionPlan.id == "free").first():
        db.add(SubscriptionPlan(
            id="free", name="Free Plan", price_monthly=0, price_yearly=0,
            features=["Basic timeline", "Limited AI", "Standard search"]
        ))
    # Premium
    if not db.query(SubscriptionPlan).filter(SubscriptionPlan.id == "premium").first():
        db.add(SubscriptionPlan(
            id="premium", name="Premium", price_monthly=9.99, price_yearly=99.99,
            features=["Unlimited AI", "Advanced Graph", "Unlimited captures", "Smart Automations"]
        ))
    # Pro
    if not db.query(SubscriptionPlan).filter(SubscriptionPlan.id == "pro").first():
        db.add(SubscriptionPlan(
            id="pro", name="Pro", price_monthly=19.99, price_yearly=199.99,
            features=["Everything in Premium", "Teams", "API Access", "Priority AI"]
        ))
    db.commit()
