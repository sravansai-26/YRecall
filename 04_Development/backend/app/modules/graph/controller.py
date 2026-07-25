from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User
from . import service, settings_service
from .schemas import GraphNetwork, EntityDetail, GraphSettingsUpdate, GraphSettingsResponse

router = APIRouter()

@router.get("/network", response_model=dict)
def get_knowledge_graph(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Todo: implement 5-minute Redis caching if requested, 
    # but currently using simple direct DB fetch.
    network = service.get_network(db, str(current_user.id))
    return {
        "success": True,
        "message": "Graph network retrieved successfully.",
        "data": network
    }

@router.get("/entity/{entity_id}", response_model=dict)
def get_entity_detail(
    entity_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entity = service.get_entity(db, str(current_user.id), entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
        
    return {
        "success": True,
        "message": "Entity retrieved successfully.",
        "data": entity
    }

@router.get("/settings", response_model=dict)
def get_graph_settings_and_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = settings_service.get_or_create_settings(db, str(current_user.id))
    stats = settings_service.get_statistics(db, str(current_user.id))
    
    return {
        "settings": GraphSettingsResponse.model_validate(settings),
        "statistics": stats
    }

@router.patch("/settings", response_model=GraphSettingsResponse)
def update_graph_settings(
    settings_update: GraphSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updates = settings_update.model_dump(exclude_unset=True)
    return settings_service.update_settings(db, str(current_user.id), updates)

@router.post("/maintenance/{action}")
def perform_maintenance_action(
    action: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    valid_actions = [
        "rebuild", "recalculate", "optimize", 
        "repair", "merge", "clean", "reindex"
    ]
    if action not in valid_actions:
        raise HTTPException(status_code=400, detail="Invalid maintenance action")
        
    # In a real system, this would trigger a background task (e.g., Celery)
    import time
    # Mocking a slight delay to simulate async dispatch
    time.sleep(0.5)
    
    return {
        "success": True,
        "message": f"Maintenance action '{action}' queued successfully.",
        "status": "processing"
    }
