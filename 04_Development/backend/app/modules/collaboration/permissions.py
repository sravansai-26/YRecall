from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from .models import WorkspaceMember, WorkspaceRole
from ...modules.users.models import User

# Role hierarchy: Owner > Admin > Editor > Contributor > Viewer
ROLE_LEVELS = {
    WorkspaceRole.OWNER: 50,
    WorkspaceRole.ADMIN: 40,
    WorkspaceRole.EDITOR: 30,
    WorkspaceRole.CONTRIBUTOR: 20,
    WorkspaceRole.VIEWER: 10
}

def get_member_role(db: Session, workspace_id: UUID, user_id: UUID) -> WorkspaceRole:
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    
    if not member:
        return None
    return member.role

def require_role(db: Session, workspace_id: UUID, user: User, min_role: WorkspaceRole):
    """
    Throws 403 Forbidden if the user does not have the required minimum role.
    """
    user_role = get_member_role(db, workspace_id, user.id)
    if not user_role:
        raise HTTPException(status_code=403, detail="You are not a member of this workspace.")
        
    if ROLE_LEVELS[user_role] < ROLE_LEVELS[min_role]:
        raise HTTPException(status_code=403, detail=f"Insufficient permissions. Requires at least {min_role.value} role.")
        
    return user_role

def can_edit(user_role: WorkspaceRole) -> bool:
    if not user_role: return False
    return ROLE_LEVELS[user_role] >= ROLE_LEVELS[WorkspaceRole.EDITOR]

def can_delete(user_role: WorkspaceRole) -> bool:
    if not user_role: return False
    return ROLE_LEVELS[user_role] >= ROLE_LEVELS[WorkspaceRole.ADMIN]

def can_invite(user_role: WorkspaceRole) -> bool:
    if not user_role: return False
    return ROLE_LEVELS[user_role] >= ROLE_LEVELS[WorkspaceRole.ADMIN]

def is_owner(user_role: WorkspaceRole) -> bool:
    if not user_role: return False
    return user_role == WorkspaceRole.OWNER
