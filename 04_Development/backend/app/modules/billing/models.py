import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, JSON, Float
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from ...core.database import Base

class SubscriptionPlan(Base):
    __tablename__ = "billing_subscription_plans"
    
    id = Column(String, primary_key=True, index=True) # e.g., "free", "premium", "pro"
    name = Column(String, nullable=False)
    description = Column(String)
    price_monthly = Column(Float, default=0.0)
    price_yearly = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    is_active = Column(Boolean, default=True)
    features = Column(JSON, default=list) # List of feature strings
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Subscription(Base):
    __tablename__ = "billing_subscriptions"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    plan_id = Column(String, ForeignKey("billing_subscription_plans.id"))
    
    status = Column(String, default="active") # active, past_due, canceled, incomplete
    provider = Column(String) # razorpay, stripe, apple, google
    provider_subscription_id = Column(String, index=True)
    provider_customer_id = Column(String)
    
    current_period_start = Column(DateTime(timezone=True))
    current_period_end = Column(DateTime(timezone=True))
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="subscription")
    plan = relationship("SubscriptionPlan")

class BillingUsage(Base):
    __tablename__ = "billing_usage"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    
    # Monthly tracked quotas
    ai_requests_count = Column(Integer, default=0)
    captures_count = Column(Integer, default=0)
    storage_used_bytes = Column(Integer, default=0) # Total overall storage
    workspaces_count = Column(Integer, default=0)
    
    # Reset period (e.g. start of month)
    period_start = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Invoice(Base):
    __tablename__ = "billing_invoices"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    subscription_id = Column(PG_UUID(as_uuid=True), ForeignKey("billing_subscriptions.id", ondelete="SET NULL"), nullable=True)
    
    provider_invoice_id = Column(String, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    status = Column(String) # paid, open, void, uncollectible
    
    invoice_pdf_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class BillingEvent(Base):
    __tablename__ = "billing_events"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), index=True)
    event_type = Column(String, index=True) # subscription_created, payment_failed, webhook_received
    payload = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
