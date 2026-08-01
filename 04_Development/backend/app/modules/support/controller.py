from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.core.database import get_db
from ...core.security import get_current_user
from app.modules.users.models import User
from . import schemas, service

router = APIRouter(prefix="/support", tags=["Support"])

@router.post("/contact", response_model=schemas.SupportTicketResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_request(
    request: schemas.ContactRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a contact support request"""
    ticket = await service.create_support_ticket(db, current_user.id, request)
    return ticket

@router.post("/bug", response_model=schemas.BugReportResponse, status_code=status.HTTP_201_CREATED)
async def submit_bug_report(
    request: schemas.BugReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a bug report"""
    bug = await service.create_bug_report(db, current_user.id, request, user_email=current_user.email)
    return bug

@router.get("/faq", response_model=List[Dict[str, Any]])
def get_faq_list():
    """Get dynamic FAQ list"""
    return service.get_faqs()

@router.get("/resources", response_model=List[Dict[str, Any]])
def get_resources_list():
    """Get useful resources and links"""
    return service.get_resources()

@router.get("/tickets", response_model=List[schemas.SupportTicketResponse])
def get_user_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all support tickets for the current user"""
    return service.get_user_tickets(db, current_user.id)

@router.get("/status", response_model=Dict[str, Any])
def get_system_status():
    """Get current system status for emergency banners"""
    return service.get_system_status()
