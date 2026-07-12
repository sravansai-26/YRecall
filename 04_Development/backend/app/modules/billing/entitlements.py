from sqlalchemy.orm import Session
from uuid import UUID
import enum
from typing import Dict, Any, List

from .models import Subscription, SubscriptionPlan, BillingUsage

class FeatureEnum(str, enum.Enum):
    UNLIMITED_AI = "UNLIMITED_AI"
    ADVANCED_GRAPH = "ADVANCED_GRAPH"
    TEAMS = "TEAMS"
    AUTOMATIONS = "AUTOMATIONS"
    PRO_REFLECTIONS = "PRO_REFLECTIONS"
    EXPORT_DATA = "EXPORT_DATA"
    PRIORITY_AI = "PRIORITY_AI"
    ADVANCED_SEARCH = "ADVANCED_SEARCH"
    VOICE_TRANSCRIPTION = "VOICE_TRANSCRIPTION"
    PDF_ANALYSIS = "PDF_ANALYSIS"
    CREATE_WORKSPACE = "CREATE_WORKSPACE"

# Define default limits for Free plan
FREE_LIMITS = {
    "ai_requests_monthly": 100,
    "workspaces_count": 1,
    "storage_bytes": 100 * 1024 * 1024, # 100 MB
    "captures_monthly": 50
}

# Define features available on plans
PLAN_FEATURES = {
    "free": [FeatureEnum.CREATE_WORKSPACE],
    "premium": [
        FeatureEnum.UNLIMITED_AI,
        FeatureEnum.ADVANCED_GRAPH,
        FeatureEnum.AUTOMATIONS,
        FeatureEnum.ADVANCED_SEARCH,
        FeatureEnum.VOICE_TRANSCRIPTION,
        FeatureEnum.PDF_ANALYSIS,
        FeatureEnum.CREATE_WORKSPACE
    ],
    "pro": [
        FeatureEnum.UNLIMITED_AI,
        FeatureEnum.ADVANCED_GRAPH,
        FeatureEnum.TEAMS,
        FeatureEnum.AUTOMATIONS,
        FeatureEnum.PRO_REFLECTIONS,
        FeatureEnum.EXPORT_DATA,
        FeatureEnum.PRIORITY_AI,
        FeatureEnum.ADVANCED_SEARCH,
        FeatureEnum.VOICE_TRANSCRIPTION,
        FeatureEnum.PDF_ANALYSIS,
        FeatureEnum.CREATE_WORKSPACE
    ]
}

def get_user_plan_id(db: Session, user_id: UUID) -> str:
    sub = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).first()
    return sub.plan_id if sub else "free"

def has_entitlement(db: Session, user_id: UUID, feature: FeatureEnum) -> bool:
    """
    Check if a user is entitled to a specific feature based on their active subscription.
    """
    plan_id = get_user_plan_id(db, user_id)
    allowed_features = PLAN_FEATURES.get(plan_id, PLAN_FEATURES["free"])
    return feature in allowed_features

def check_quota(db: Session, user_id: UUID, quota_key: str) -> bool:
    """
    Check if a user has remaining quota for a specific metric.
    Returns True if allowed (under limit or unlimited), False if exceeded.
    """
    plan_id = get_user_plan_id(db, user_id)
    
    # Premium and Pro have unlimited for most things
    if plan_id in ["premium", "pro"]:
        if quota_key == "workspaces_count" and plan_id == "premium":
            # Let's say Premium allows 5 workspaces
            usage = db.query(BillingUsage).filter(BillingUsage.user_id == user_id).first()
            if not usage: return True
            return usage.workspaces_count < 5
        return True # Unlimited otherwise
        
    # Free plan limits
    usage = db.query(BillingUsage).filter(BillingUsage.user_id == user_id).first()
    if not usage:
        return True
        
    limit = FREE_LIMITS.get(quota_key, 0)
    
    if quota_key == "ai_requests_monthly":
        return usage.ai_requests_count < limit
    elif quota_key == "workspaces_count":
        return usage.workspaces_count < limit
    elif quota_key == "storage_bytes":
        return usage.storage_used_bytes < limit
    elif quota_key == "captures_monthly":
        return usage.captures_count < limit
        
    return False
