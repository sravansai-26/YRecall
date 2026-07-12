from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...core.database import get_db
from ...core.security import get_current_user
from ...modules.users.models import User

from . import schemas, workspace_service
from .permissions import require_role, WorkspaceRole
from ...core.websockets import manager

router = APIRouter(tags=["collaboration"])

@router.websocket("/ws/{workspace_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: str):
    await manager.connect(websocket, workspace_id)
    try:
        while True:
            # We don't really expect clients to send much except ping/pong
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, workspace_id)

@router.get("/workspaces", response_model=List[schemas.WorkspaceResponse])
def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return workspace_service.get_user_workspaces(db, current_user.id)

@router.post("/workspaces", response_model=schemas.WorkspaceResponse)
def create_workspace(
    workspace_in: schemas.WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return workspace_service.create_workspace(db, current_user, workspace_in)

@router.get("/workspaces/{workspace_id}", response_model=schemas.WorkspaceResponse)
def get_workspace(
    workspace_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_role(db, workspace_id, current_user, WorkspaceRole.VIEWER)
    workspace = workspace_service.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.put("/workspaces/{workspace_id}", response_model=schemas.WorkspaceResponse)
def update_workspace(
    workspace_id: UUID,
    workspace_in: schemas.WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_role(db, workspace_id, current_user, WorkspaceRole.ADMIN)
    workspace = workspace_service.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    return workspace_service.update_workspace(db, current_user, workspace, workspace_in)

@router.post("/workspaces/{workspace_id}/invitations", response_model=schemas.InvitationResponse)
def create_invitation(
    workspace_id: UUID,
    invitation_in: schemas.InvitationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_role(db, workspace_id, current_user, WorkspaceRole.ADMIN)
    return workspace_service.create_invitation(db, current_user, workspace_id, invitation_in)

@router.post("/invitations/accept", response_model=schemas.WorkspaceResponse)
def accept_invitation(
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return workspace_service.accept_invitation(db, current_user, token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/workspaces/{workspace_id}/members", response_model=List[schemas.WorkspaceMemberResponse])
def get_workspace_members(
    workspace_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_role(db, workspace_id, current_user, WorkspaceRole.VIEWER)
    return workspace_service.get_workspace_members(db, workspace_id)

@router.delete("/workspaces/{workspace_id}/members/{target_user_id}")
def remove_workspace_member(
    workspace_id: UUID,
    target_user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_role(db, workspace_id, current_user, WorkspaceRole.ADMIN)
    if current_user.id == target_user_id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself. Use leave instead.")
    workspace_service.remove_workspace_member(db, current_user, workspace_id, target_user_id)
    return {"success": True, "message": "Member removed."}

@router.post("/workspaces/{workspace_id}/captures/{capture_id}")
async def share_capture_to_workspace(
    workspace_id: UUID,
    capture_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_role(db, workspace_id, current_user, WorkspaceRole.CONTRIBUTOR)
    shared_capture = workspace_service.share_capture(db, current_user, workspace_id, capture_id)
    
    # Broadcast to all workspace members
    await manager.broadcast_to_workspace(str(workspace_id), {
        "event": "CAPTURE_SHARED",
        "data": {
            "capture_id": str(capture_id),
            "shared_by": str(current_user.id),
            "workspace_id": str(workspace_id)
        }
    })
    
    return {"success": True, "data": schemas.SharedCaptureResponse.model_validate(shared_capture)}
