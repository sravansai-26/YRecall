from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

# --- UserPersona ---

class UserPersonaBase(BaseModel):
    communication_style: Optional[str] = None
    thinking_style: Optional[str] = None
    productivity_style: Optional[str] = None
    personality: Optional[str] = None
    occupation: Optional[str] = None
    interests: Optional[List[str]] = None
    preferred_language: Optional[str] = None
    preferred_ai_tone: Optional[str] = None
    notification_preference: Optional[str] = None
    work_schedule: Optional[str] = None
    sleep_schedule: Optional[str] = None
    timezone: Optional[str] = None
    memory_goals: Optional[str] = None
    long_term_goals: Optional[str] = None
    preferred_summary_size: Optional[str] = None

class UserPersonaUpdate(UserPersonaBase):
    pass

class UserPersonaOut(UserPersonaBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- UserGoal ---

class UserGoalBase(BaseModel):
    title: str
    category: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    status: str = "active"

class UserGoalCreate(UserGoalBase):
    pass

class UserGoalUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    status: Optional[str] = None

class UserGoalOut(UserGoalBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- UserPreferences ---

class UserPreferencesBase(BaseModel):
    theme: Optional[str] = "system"
    language: Optional[str] = "en"
    units: Optional[str] = "metric"
    calendar: Optional[str] = "gregorian"
    privacy: Optional[str] = "standard"
    ai_verbosity: Optional[str] = "balanced"
    response_style: Optional[str] = "conversational"
    emoji_preference: Optional[str] = "enabled"
    markdown_preference: Optional[str] = "enabled"
    voice_preference: Optional[str] = None

class UserPreferencesUpdate(UserPreferencesBase):
    pass

class UserPreferencesOut(UserPreferencesBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- UserBehavior ---

class UserBehaviorBase(BaseModel):
    data: Dict[str, Any] = Field(default_factory=dict)

class UserBehaviorUpdate(BaseModel):
    # Only incremental updates normally, but we can accept full override here
    data: Dict[str, Any]

class UserBehaviorOut(UserBehaviorBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Aggregate Output ---

class PersonaProfileOut(BaseModel):
    persona: Optional[UserPersonaOut] = None
    preferences: Optional[UserPreferencesOut] = None
    goals: List[UserGoalOut] = []
    behavior: Optional[UserBehaviorOut] = None
