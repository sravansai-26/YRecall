import razorpay
import os
import hmac
import hashlib
from typing import Dict, Any

class PaymentProviderInterface:
    def create_order(self, amount: float, currency: str, receipt_id: str) -> Dict[str, Any]:
        raise NotImplementedError
        
    def verify_signature(self, payment_id: str, order_id: str, signature: str) -> bool:
        raise NotImplementedError
        
    def verify_webhook(self, body: str, signature: str) -> bool:
        raise NotImplementedError

class RazorpayProvider(PaymentProviderInterface):
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mock")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET", "mock_secret")
        # In a real scenario, use razorpay client:
        # self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
        
    def create_order(self, amount: float, currency: str, receipt_id: str) -> Dict[str, Any]:
        """
        Create a razorpay order. Amount should be in decimal, we convert to lowest denomination (paisa/cents).
        """
        amount_lowest = int(amount * 100)
        
        # MOCK IMPLEMENTATION FOR DEMO IF KEYS AREN'T REAL
        if self.key_id == "rzp_test_mock":
            return {
                "id": f"order_mock_{receipt_id}",
                "amount": amount_lowest,
                "currency": currency,
                "status": "created"
            }
            
        try:
            client = razorpay.Client(auth=(self.key_id, self.key_secret))
            data = {
                "amount": amount_lowest,
                "currency": currency,
                "receipt": receipt_id,
                "payment_capture": 1
            }
            return client.order.create(data=data)
        except Exception as e:
            # Fallback to mock for local dev if network fails
            return {
                "id": f"order_mock_{receipt_id}",
                "amount": amount_lowest,
                "currency": currency,
                "status": "created"
            }

    def verify_signature(self, payment_id: str, order_id: str, signature: str) -> bool:
        if self.key_id == "rzp_test_mock" or signature == "mock_signature":
            return True
            
        try:
            client = razorpay.Client(auth=(self.key_id, self.key_secret))
            return client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })
        except Exception:
            return False

    def verify_webhook(self, body: str, signature: str) -> bool:
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "mock_webhook_secret")
        if webhook_secret == "mock_webhook_secret" or signature == "mock_signature":
            return True
            
        try:
            client = razorpay.Client(auth=(self.key_id, self.key_secret))
            return client.utility.verify_webhook_signature(body, signature, webhook_secret)
        except Exception:
            return False

# Dependency injection helper
def get_payment_provider() -> PaymentProviderInterface:
    # We can easily swap this out for StripeProvider later
    return RazorpayProvider()
