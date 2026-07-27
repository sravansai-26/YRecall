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

class ExperienceSettingsBase(BaseModel):
    theme: str = "system"
    accent_color: str = "default"
    font_size: str = "medium"
    display_density: str = "comfortable"
    language: str = "en"
    reading_mode: bool = False
    reduce_motion: bool = False
    high_contrast: bool = False
    color_blind_friendly: bool = False
    screen_reader_optimization: bool = False

class ExperienceSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    accent_color: Optional[str] = None
    font_size: Optional[str] = None
    display_density: Optional[str] = None
    language: Optional[str] = None
    reading_mode: Optional[bool] = None
    reduce_motion: Optional[bool] = None
    high_contrast: Optional[bool] = None
    color_blind_friendly: Optional[bool] = None
    screen_reader_optimization: Optional[bool] = None

class ExperienceSettingsResponse(ExperienceSettingsBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
