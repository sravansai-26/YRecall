import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Form, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from .schemas import (
    CaptureResponse, 
    PaginatedCaptures, 
    CaptureCreateText,
    CaptureCreateNote,
    CaptureCreateURL,
    CaptureCreateLocation,
    CaptureUpdateTitle
)
from . import service
from ...core.database import get_db
from ...core.security import get_current_user, generate_signed_url_token, verify_signed_url_token
from ...modules.users.models import User

def _get_api_base(request: Request) -> str:
    base = str(request.base_url).rstrip("/")
    if "localhost" not in base and "127.0.0.1" not in base and base.startswith("http://"):
        base = base.replace("http://", "https://")
    return base

def _serialize_capture(capture, request: Request) -> dict:
    data = CaptureResponse.model_validate(capture).model_dump()
    if data.get("file_url") and "supabase.co/storage/v1/object/public/" in data["file_url"]:
        ext = data["file_url"].rsplit(".", 1)[-1] if "." in data["file_url"] else "media"
        sig = generate_signed_url_token(str(capture.id))
        base = _get_api_base(request)
        data["file_url"] = f"{base}/api/v1/captures/{capture.id}/media/{sig}/file.{ext}"
    return data

router = APIRouter()

@router.post("/text", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_text_capture(
    capture_in: CaptureCreateText,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_text_capture(db, current_user, capture_in)
    return {
        "success": True,
        "message": "Text capture created successfully.",
        "data": _serialize_capture(capture, request)
    }

@router.post("/note", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_note_capture(
    capture_in: CaptureCreateNote,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_note_capture(db, current_user, capture_in)
    return {
        "success": True,
        "message": "Note capture created successfully.",
        "data": _serialize_capture(capture, request)
    }

@router.post("/url", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_url_capture(
    capture_in: CaptureCreateURL,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_url_capture(db, current_user, capture_in)
    return {
        "success": True,
        "message": "URL capture created successfully.",
        "data": _serialize_capture(capture, request)
    }

@router.post("/location", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_location_capture(
    capture_in: CaptureCreateLocation,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.create_location_capture(db, current_user, capture_in)
    return {
        "success": True,
        "message": "Location capture created successfully.",
        "data": _serialize_capture(capture, request)
    }

@router.post("/media", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_media_capture(
    request: Request,
    type: str = Form(...),
    file: UploadFile = File(...),
    upload_id: str = Form(None),
    title: str = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    valid_types = ["image", "video", "voice", "audio", "pdf", "document", "file", "screenshot"]
    if type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid media type. Must be one of: {valid_types}")
        
    try:
        capture = service.create_media_capture(db, current_user, file, type, upload_id, title)
        return {
            "success": True,
            "message": f"{type.capitalize()} capture created successfully.",
            "data": _serialize_capture(capture, request)
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transcribe", response_model=dict, status_code=status.HTTP_200_OK)
def transcribe_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        text = service.transcribe_audio_sync(db, current_user, file)
        return {
            "success": True,
            "message": "Audio transcribed successfully.",
            "data": {"text": text}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search", response_model=dict)
def search_captures(
    q: str,
    request: Request,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = service.search_captures(db, current_user, q, skip, limit)
    return {
        "success": True,
        "message": "Search completed successfully.",
        "data": [_serialize_capture(c, request) for c in result["data"]],
        "meta": result["meta"]
    }

@router.get("", response_model=dict)
def get_captures(
    request: Request,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = service.get_captures(db, current_user, skip, limit)
    return {
        "success": True,
        "message": "Operation completed successfully.",
        "data": [_serialize_capture(c, request) for c in result["data"]],
        "meta": result["meta"]
    }

@router.get("/{id}", response_model=dict)
def get_capture(
    id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.get_capture(db, current_user, id)
    if not capture:
        raise HTTPException(status_code=404, detail="Capture not found")
    
    return {
        "success": True,
        "message": "Operation completed successfully.",
        "data": _serialize_capture(capture, request)
    }

@router.put("/{id}/title", response_model=dict)
def update_capture_title(
    id: uuid.UUID,
    payload: CaptureUpdateTitle,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    capture = service.update_capture_title(db, current_user, id, payload.title)
    if not capture:
        raise HTTPException(status_code=404, detail="Capture not found")
        
    return {
        "success": True,
        "message": "Title updated successfully.",
        "data": _serialize_capture(capture, request)
    }

@router.delete("/{id}", response_model=dict)
def delete_capture(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = service.delete_capture(db, current_user, id)
    if not success:
        raise HTTPException(status_code=404, detail="Capture not found or already deleted")
    return {
        "success": True,
        "message": "Capture deleted successfully."
    }

@router.get("/{id}/media/{signature}/file.{ext}")
def redirect_to_signed_media(
    id: uuid.UUID,
    signature: str,
    ext: str,
    db: Session = Depends(get_db)
):
    # This endpoint is accessed without Auth headers by the mobile app's Image component.
    # We verify the HMAC signature which proves it was generated by us for this capture recently.
    if not verify_signed_url_token(str(id), signature):
        raise HTTPException(status_code=403, detail="Invalid or expired media signature")
        
    # Get the capture without user checking (since signature proves authorized access)
    from .models import Capture
    capture = db.query(Capture).filter(Capture.id == id).first()
    
    if not capture or not capture.storage_path:
        raise HTTPException(status_code=404, detail="Media not found")
        
    # Create the Supabase short-lived signed URL
    from ...core.storage import supabase, BUCKET_NAME
    # Set expiration to 3600 seconds (1 hour)
    res = supabase.storage.from_(BUCKET_NAME).create_signed_url(capture.storage_path, 3600)
    
    if "signedURL" not in res:
        raise HTTPException(status_code=500, detail="Could not generate signed URL")
        
    return RedirectResponse(url=res["signedURL"])

