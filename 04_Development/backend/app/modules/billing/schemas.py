from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class SubscriptionPlanBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    price_monthly: float
    price_yearly: float
    currency: str
    features: List[str]

class SubscriptionPlanResponse(SubscriptionPlanBase):
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class SubscriptionBase(BaseModel):
    plan_id: str
    status: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False

class SubscriptionResponse(SubscriptionBase):
    id: UUID
    user_id: UUID
    provider: Optional[str] = None
    canceled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    plan: Optional[SubscriptionPlanResponse] = None

    class Config:
        from_attributes = True

class BillingUsageResponse(BaseModel):
    id: UUID
    user_id: UUID
    ai_requests_count: int
    captures_count: int
    storage_used_bytes: int
    workspaces_count: int
    period_start: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: UUID
    user_id: UUID
    subscription_id: Optional[UUID] = None
    amount: float
    currency: str
    status: str
    invoice_pdf_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CreateOrderRequest(BaseModel):
    plan_id: str
    billing_cycle: str = Field(..., pattern="^(monthly|yearly)$")

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: float
    currency: str
    key_id: str # For frontend to init razorpay

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

class EntitlementCheckResponse(BaseModel):
    feature: str
    is_entitled: bool
    reason: Optional[str] = None
