from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[str] = None
    display_name: Optional[str] = None
    photo_url: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    firebase_uid: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
