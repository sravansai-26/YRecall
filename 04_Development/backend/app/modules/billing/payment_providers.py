import razorpay
import hmac
import hashlib
from typing import Dict, Any

from ...core.config import settings

class PaymentProviderInterface:
    def create_order(self, amount: float, currency: str, receipt_id: str, notes: dict = None) -> Dict[str, Any]:
        raise NotImplementedError
        
    def verify_signature(self, payment_id: str, order_id: str, signature: str) -> bool:
        raise NotImplementedError
        
    def verify_webhook(self, body: str, signature: str) -> bool:
        raise NotImplementedError

class RazorpayProvider(PaymentProviderInterface):
    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET
        self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
        
    def create_order(self, amount: float, currency: str, receipt_id: str, notes: dict = None) -> Dict[str, Any]:
        """
        Create a razorpay order. Amount should be in decimal, we convert to lowest denomination (paisa/cents).
        """
        amount_lowest = int(amount * 100)
        
        data = {
            "amount": amount_lowest,
            "currency": currency,
            "receipt": receipt_id,
            "payment_capture": 1
        }
        if notes:
            data["notes"] = notes
            
        return self.client.order.create(data=data)

    def verify_signature(self, payment_id: str, order_id: str, signature: str) -> bool:
        try:
            return self.client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })
        except Exception:
            return False

    def verify_webhook(self, body: str, signature: str) -> bool:
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        try:
            return self.client.utility.verify_webhook_signature(body, signature, webhook_secret)
        except Exception:
            return False

# Dependency injection helper
def get_payment_provider() -> PaymentProviderInterface:
    # We can easily swap this out for StripeProvider later
    return RazorpayProvider()
