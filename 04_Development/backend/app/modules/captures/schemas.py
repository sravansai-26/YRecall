from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class CaptureResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    content_text: Optional[str] = None
    file_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class PaginatedCaptures(BaseModel):
    meta: dict
    data: list[CaptureResponse]

class CaptureCreateText(BaseModel):
    content_text: str
