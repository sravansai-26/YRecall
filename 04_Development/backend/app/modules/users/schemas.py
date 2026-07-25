from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[str] = None
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    website: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    birthday: Optional[datetime] = None

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: UUID
    firebase_uid: str
    last_login: Optional[datetime] = None
    last_sync: Optional[datetime] = None
    current_streak: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
