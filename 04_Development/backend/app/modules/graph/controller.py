from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User
from . import service
from .schemas import GraphNetwork, EntityDetail

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
