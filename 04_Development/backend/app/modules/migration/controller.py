from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...core.database import get_db
from ...core.security import get_current_user
from ..users.models import User
from .models import MigrationJob
from .schemas import MigrationJobResponse, ExportRequest, ImportPreviewRequest, ImportPreviewResponse, ImportConfirmRequest
from .engine import execute_export_task, execute_import_task

router = APIRouter()

@router.post("/export", response_model=MigrationJobResponse)
async def create_export_job(
    request: ExportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a new export job and queues it for background processing."""
    job = MigrationJob(
        user_id=current_user.id,
        job_type="export",
        categories=request.categories,
        archive_format=request.archive_format,
        compression_type=request.compression_type
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(execute_export_task, job.id)
    return job

@router.post("/import/preview", response_model=ImportPreviewResponse)
async def preview_import(
    request: ImportPreviewRequest,
    current_user: User = Depends(get_current_user)
):
    """Parses an uploaded file and returns a preview of what will be imported."""
    # Stub response
    return ImportPreviewResponse(
        is_valid=True,
        version="1.0",
        categories_found=["memories"],
        item_counts={"memories": 120},
        estimated_duration_seconds=5,
        warnings=[],
        conflicts_detected=0
    )

@router.post("/import", response_model=MigrationJobResponse)
async def confirm_import(
    request: ImportConfirmRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Confirms import and starts the background task."""
    job = MigrationJob(
        user_id=current_user.id,
        job_type="import",
        restore_mode=request.restore_mode,
        file_url=request.file_url
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(execute_import_task, job.id)
    return job

from fastapi.responses import FileResponse
import os

@router.get("/download/{filename}")
async def download_export_file(filename: str, current_user: User = Depends(get_current_user)):
    """Downloads an export file from the local storage."""
    file_path = os.path.join("/tmp/yrecall_exports", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)

@router.get("/jobs", response_model=List[MigrationJobResponse])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all migration jobs for the user."""
    return db.query(MigrationJob).filter(MigrationJob.user_id == current_user.id).order_by(MigrationJob.created_at.desc()).all()

@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deletes a migration job record."""
    job = db.query(MigrationJob).filter(MigrationJob.id == job_id, MigrationJob.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Optionally delete the file from storage here as well, if we have a file_url.
    # For now, just deleting the DB record is enough to remove it from the history.
    db.delete(job)
    db.commit()
    return None
