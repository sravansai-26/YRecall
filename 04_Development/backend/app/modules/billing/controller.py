from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import json

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

from . import schemas, subscription_service, quota_service, entitlements
from .models import BillingEvent, Invoice
from .payment_providers import get_payment_provider, PaymentProviderInterface

router = APIRouter(tags=["billing"])

@router.get("/plans", response_model=List[schemas.SubscriptionPlanResponse])
def get_plans(db: Session = Depends(get_db)):
    """Get all active subscription plans."""
    return subscription_service.get_all_plans(db)

@router.get("/subscription", response_model=schemas.SubscriptionResponse)
def get_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current user's active subscription."""
    sub = subscription_service.get_user_subscription(db, current_user.id)
    if not sub:
        # Default to free plan representation if none exists in db
        free_plan = subscription_service.get_plan(db, "free")
        return {
            "id": current_user.id, # Fake ID just to satisfy schema
            "user_id": current_user.id,
            "plan_id": "free",
            "status": "active",
            "provider": None,
            "created_at": current_user.created_at,
            "updated_at": current_user.created_at,
            "plan": free_plan
        }
    return sub

@router.post("/create-order", response_model=schemas.CreateOrderResponse)
def create_order(
    request: schemas.CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    provider: PaymentProviderInterface = Depends(get_payment_provider)
):
    """Create a new payment order for checkout."""
    plan = subscription_service.get_plan(db, request.plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    amount = plan.price_yearly if request.billing_cycle == "yearly" else plan.price_monthly
    
    if amount == 0:
        # It's a free plan, just downgrade/set it directly
        subscription_service.create_or_update_subscription(
            db, current_user.id, plan.id, provider="system", provider_subscription_id="free"
        )
        return {"order_id": "free", "amount": 0, "currency": plan.currency, "key_id": "free"}
        
    # Create razorpay order
    receipt = f"rcpt_{current_user.id.hex[:8]}_{plan.id}"
    notes = {
        "user_id": str(current_user.id),
        "plan_id": plan.id,
        "billing_cycle": request.billing_cycle
    }
    order = provider.create_order(amount, plan.currency, receipt, notes=notes)
    
    # Store billing event for audit
    event = BillingEvent(user_id=current_user.id, event_type="order_created", payload=order)
    db.add(event)
    db.commit()
    
    return {
        "order_id": order["id"],
        "amount": amount,
        "currency": plan.currency,
        "key_id": getattr(provider, 'key_id', 'mock_key')
    }

@router.post("/verify-payment", response_model=schemas.SubscriptionResponse)
def verify_payment(
    request: schemas.VerifyPaymentRequest,
    plan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    provider: PaymentProviderInterface = Depends(get_payment_provider)
):
    """Verify payment signature and activate subscription."""
    is_valid = provider.verify_signature(
        request.razorpay_payment_id, 
        request.razorpay_order_id, 
        request.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
        
    # Payment is valid, activate subscription
    sub = subscription_service.create_or_update_subscription(
        db, current_user.id, plan_id, "razorpay", request.razorpay_subscription_id if hasattr(request, 'razorpay_subscription_id') else request.razorpay_payment_id
    )
    
    # Determine price for invoice
    plan = subscription_service.get_plan(db, plan_id)
    amount = plan.price_yearly if request.billing_cycle == "yearly" else plan.price_monthly
    
    # Create Invoice record
    invoice = Invoice(
        user_id=current_user.id,
        subscription_id=sub.id,
        provider_invoice_id=request.razorpay_payment_id,
        amount=amount,
        currency=plan.currency,
        status="paid"
    )
    db.add(invoice)
    
    # Audit log
    event = BillingEvent(user_id=current_user.id, event_type="payment_verified", payload=request.model_dump())
    db.add(event)
    db.commit()
    
    return sub

@router.post("/webhook")
async def provider_webhook(
    request: Request,
    db: Session = Depends(get_db),
    provider: PaymentProviderInterface = Depends(get_payment_provider)
):
    """Webhook endpoint for payment providers (Razorpay)."""
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    
    if not provider.verify_webhook(body.decode('utf-8'), signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
        
    payload = json.loads(body)
    event_type = payload.get("event")
    
    # Audit log
    event = BillingEvent(event_type=f"webhook_{event_type}", payload=payload)
    db.add(event)
    
    # Handle specific events
    if event_type in ("payment.captured", "order.paid"):
        entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        if not entity:
            entity = payload.get("payload", {}).get("order", {}).get("entity", {})
            
        notes = entity.get("notes", {})
        user_id_str = notes.get("user_id")
        plan_id = notes.get("plan_id")
        
        if user_id_str and plan_id:
            from uuid import UUID
            user_id = UUID(user_id_str)
            
            # Activate subscription based purely on webhook truth
            sub = subscription_service.create_or_update_subscription(
                db, user_id, plan_id, "razorpay", entity.get("id", "webhook_prov_id")
            )
            
            # Create Invoice if not already created by client verify_payment callback
            provider_payment_id = entity.get("id")
            existing_invoice = db.query(Invoice).filter(Invoice.provider_invoice_id == provider_payment_id).first()
            if not existing_invoice:
                invoice = Invoice(
                    user_id=user_id,
                    subscription_id=sub.id,
                    provider_invoice_id=provider_payment_id,
                    amount=entity.get("amount", 0) / 100.0,
                    currency=entity.get("currency", "INR"),
                    status="paid"
                )
                db.add(invoice)
                
    db.commit()
    return {"status": "ok"}

@router.post("/cancel", response_model=schemas.SubscriptionResponse)
def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = subscription_service.cancel_subscription(db, current_user.id)
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription found")
    return sub

@router.get("/usage", response_model=schemas.BillingUsageResponse)
def get_user_usage(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current user's usage metrics against their quotas."""
    return quota_service.get_usage(db, current_user.id)

@router.get("/entitlements/{feature}", response_model=schemas.EntitlementCheckResponse)
def check_entitlement(
    feature: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check if the user has access to a specific premium feature."""
    try:
        feature_enum = entitlements.FeatureEnum(feature)
        is_entitled = entitlements.has_entitlement(db, current_user.id, feature_enum)
        return {"feature": feature, "is_entitled": is_entitled}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid feature name")

@router.get("/invoices", response_model=List[schemas.InvoiceResponse])
def get_user_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all invoices/transactions for the current user."""
    invoices = db.query(Invoice).filter(Invoice.user_id == current_user.id).order_by(Invoice.created_at.desc()).all()
    return invoices

@router.get("/invoices/{invoice_id}/download")
def download_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate and return a PDF invoice."""
    from fastapi.responses import Response
    import io
    
    # Try finding the invoice
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.user_id == current_user.id).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    amount = invoice.amount
    currency = invoice.currency
    date_str = invoice.created_at.strftime("%B %d, %Y")
        
    # Generate PDF
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        
        # Header
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, 750, "YRecall AI Life OS")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, 720, "INVOICE")
        c.drawString(400, 720, f"Date: {date_str}")
        c.drawString(400, 700, f"Invoice #: {str(invoice_id)[:8].upper()}")
        
        # Bill To
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, 660, "Billed To:")
        c.setFont("Helvetica", 12)
        c.drawString(50, 640, current_user.full_name or "YRecall User")
        c.drawString(50, 620, current_user.email)
        
        # Line Items
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, 560, "Description")
        c.drawString(400, 560, "Amount")
        c.line(50, 550, 550, 550)
        
        c.setFont("Helvetica", 12)
        c.drawString(50, 530, "Premium Subscription")
        c.drawString(400, 530, f"{currency} {amount}")
        
        c.line(50, 480, 550, 480)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(300, 450, "Total:")
        c.drawString(400, 450, f"{currency} {amount}")
        
        c.showPage()
        c.save()
        
        pdf = buffer.getvalue()
        buffer.close()
        
        return Response(
            content=pdf, 
            media_type="application/pdf", 
            headers={"Content-Disposition": f'attachment; filename="YRecall_Invoice_{str(invoice_id)[:8]}.pdf"'}
        )
    except ImportError:
        raise HTTPException(status_code=500, detail="PDF generation library not installed")
