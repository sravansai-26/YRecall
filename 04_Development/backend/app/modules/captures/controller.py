import uuid
from fastapi import APIRouter, Depends, BackgroundTasks, UploadFile, File, HTTPException, status, Form
from sqlalchemy.orm import Session
from .schemas import (
    CaptureResponse, 
    PaginatedCaptures, 
    CaptureCreateText,
    CaptureCreateNote,
    CaptureCreateURL,
    CaptureCreateLocation
)
from . import service
from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

router = APIRouter()

@router.post("/text", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_text_capture(
    capture_in: CaptureCreateText,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_text_capture(db, current_user, capture_in, background_tasks)
    return {
        "success": True,
        "message": "Text capture created successfully.",
        "data": CaptureResponse.model_validate(capture).model_dump()
    }

@router.post("/note", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_note_capture(
    capture_in: CaptureCreateNote,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_note_capture(db, current_user, capture_in, background_tasks)
    return {
        "success": True,
        "message": "Note capture created successfully.",
        "data": CaptureResponse.model_validate(capture).model_dump()
    }

@router.post("/url", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_url_capture(
    capture_in: CaptureCreateURL,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_url_capture(db, current_user, capture_in, background_tasks)
    return {
        "success": True,
        "message": "URL capture created successfully.",
        "data": CaptureResponse.model_validate(capture).model_dump()
    }

@router.post("/location", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_location_capture(
    capture_in: CaptureCreateLocation,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_location_capture(db, current_user, capture_in, background_tasks)
    return {
        "success": True,
        "message": "Location capture created successfully.",
        "data": CaptureResponse.model_validate(capture).model_dump()
    }

@router.post("/media", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_media_capture(
    type: str = Form(...),
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    valid_types = ["image", "video", "voice", "audio", "pdf", "document", "file", "screenshot"]
    if type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid media type. Must be one of: {valid_types}")
        
    try:
        capture = service.create_media_capture(db, current_user, file, type, background_tasks)
        return {
            "success": True,
            "message": f"{type.capitalize()} capture created successfully.",
            "data": CaptureResponse.model_validate(capture).model_dump()
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=dict)
def get_captures(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = service.get_captures(db, current_user, skip, limit)
    return {
        "success": True,
        "message": "Operation completed successfully.",
        "data": [CaptureResponse.model_validate(c).model_dump() for c in result["data"]],
        "meta": result["meta"]
    }

@router.get("/{id}", response_model=dict)
def get_capture(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.get_capture(db, current_user, id)
    if not capture:
        raise HTTPException(status_code=404, detail="Capture not found")
    
    return {
        "success": True,
        "message": "Operation completed successfully.",
        "data": CaptureResponse.model_validate(capture).model_dump()
    }
