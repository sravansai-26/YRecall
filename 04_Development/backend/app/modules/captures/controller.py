import uuid
from fastapi import APIRouter, Depends, BackgroundTasks, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from .schemas import CaptureResponse, PaginatedCaptures, CaptureCreateText
from . import service
from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

router = APIRouter()

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_text_capture(
    capture_in: CaptureCreateText,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_text_capture(db, current_user, capture_in, background_tasks)
    return {
        "success": True,
        "message": "Capture created successfully.",
        "data": CaptureResponse.model_validate(capture).model_dump()
    }

@router.post("/voice", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_voice_capture(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        capture = service.create_voice_capture(db, current_user, file, background_tasks)
        return {
            "success": True,
            "message": "Voice capture created successfully.",
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
    # Ensure standard response format
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
