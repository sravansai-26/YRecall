from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from .models import SupportStatus

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=10)
    attachments: Optional[List[str]] = []

class BugReportRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=10)
    category: str
    priority: Optional[str] = "medium"
    device_info: Optional[Dict[str, Any]] = {}
    logs: Optional[str] = None
    screenshot_url: Optional[str] = None

class SupportTicketResponse(BaseModel):
    id: UUID
    ticket_id: str
    user_id: Optional[UUID]
    name: str
    subject: str
    status: SupportStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class BugReportResponse(BaseModel):
    id: UUID
    bug_id: str
    user_id: Optional[UUID]
    title: str
    category: str
    status: SupportStatus
    created_at: datetime
    
    class Config:
        from_attributes = True
