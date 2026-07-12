from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from .models import WorkspaceRole

# Workspaces
class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    avatar: Optional[str] = None
    visibility: Optional[str] = "private"
    color: Optional[str] = None
    theme_color: Optional[str] = None
    background_image_url: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    avatar: Optional[str] = None
    visibility: Optional[str] = None
    color: Optional[str] = None
    theme_color: Optional[str] = None
    background_image_url: Optional[str] = None

class WorkspaceResponse(WorkspaceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Members
class WorkspaceMemberBase(BaseModel):
    user_id: UUID
    role: WorkspaceRole

class WorkspaceMemberCreate(WorkspaceMemberBase):
    pass

class WorkspaceMemberResponse(WorkspaceMemberBase):
    id: UUID
    workspace_id: UUID
    joined_at: datetime

    class Config:
        from_attributes = True

# Invitations
class InvitationCreate(BaseModel):
    email: Optional[str] = None
    target_user_id: Optional[UUID] = None
    role: WorkspaceRole = WorkspaceRole.VIEWER

class InvitationResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    invited_by: UUID
    email: Optional[str] = None
    target_user_id: Optional[UUID] = None
    role: WorkspaceRole
    status: str
    token: Optional[str] = None
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Shared Captures
class SharedCaptureCreate(BaseModel):
    capture_id: UUID
    permissions: Optional[Dict[str, Any]] = {}

class SharedCaptureResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    capture_id: UUID
    shared_by: UUID
    permissions: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Activity
class WorkspaceActivityResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    actor_id: UUID
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    metadata_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
