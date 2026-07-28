from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User
from . import schemas
from . import service

router = APIRouter(tags=["storage"])

@router.get("/stats", response_model=schemas.StorageStatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.get_storage_statistics(db, current_user)

@router.post("/sync", response_model=schemas.SyncResponse)
def perform_sync(
    request: schemas.SyncRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.perform_sync(db, current_user, request)
