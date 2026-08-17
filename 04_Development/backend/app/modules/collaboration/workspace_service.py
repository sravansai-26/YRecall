from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from .models import Workspace, WorkspaceMember, WorkspaceRole, WorkspaceActivity
from .schemas import WorkspaceCreate, WorkspaceUpdate
from ...modules.users.models import User

def get_user_workspaces(db: Session, user_id: UUID) -> List[Workspace]:
    return db.query(Workspace).join(WorkspaceMember).filter(
        WorkspaceMember.user_id == user_id,
        Workspace.deleted_at == None
    ).all()

def get_workspace(db: Session, workspace_id: UUID) -> Workspace:
    return db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.deleted_at == None
    ).first()

from ..billing import entitlements, quota_service
from fastapi import HTTPException

def create_workspace(db: Session, user: User, workspace_in: WorkspaceCreate) -> Workspace:
    # Temporary limit: users can own up to 6 active workspaces until billing is fully implemented.
    active_owned_count = db.query(Workspace).join(WorkspaceMember).filter(
        WorkspaceMember.user_id == user.id,
        WorkspaceMember.role == WorkspaceRole.OWNER,
        Workspace.deleted_at == None
    ).count()

    if active_owned_count >= 6:
        raise HTTPException(status_code=403, detail="Workspace limit reached. You can only own up to 6 active workspaces. Delete one to create another.")

    workspace = Workspace(
        name=workspace_in.name,
        description=workspace_in.description,
        avatar=workspace_in.avatar,
        visibility=workspace_in.visibility,
        color=workspace_in.color,
        theme_color=workspace_in.theme_color,
        background_image_url=workspace_in.background_image_url
    )
    db.add(workspace)
    db.flush() # get ID
    
    # Add creator as OWNER
    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=user.id,
        role=WorkspaceRole.OWNER
    )
    db.add(member)
    
    # Log activity
    activity = WorkspaceActivity(
        workspace_id=workspace.id,
        actor_id=user.id,
        action="created_workspace",
        entity_type="workspace",
        entity_id=str(workspace.id)
    )
    db.add(activity)
    
    db.commit()
    db.refresh(workspace)
    # Update quota
    current_count = db.query(Workspace).join(WorkspaceMember).filter(
        WorkspaceMember.user_id == user.id,
        Workspace.deleted_at == None
    ).count()
    quota_service.update_workspaces_count(db, user.id, current_count)
    
    return workspace

def update_workspace(db: Session, user: User, workspace: Workspace, workspace_in: WorkspaceUpdate) -> Workspace:
    update_data = workspace_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(workspace, key, value)
        
    activity = WorkspaceActivity(
        workspace_id=workspace.id,
        actor_id=user.id,
        action="updated_workspace",
        entity_type="workspace",
        entity_id=str(workspace.id),
        metadata_json=update_data
    )
    db.add(activity)
    
    db.commit()
    db.refresh(workspace)
    return workspace

def get_workspace_members(db: Session, workspace_id: UUID) -> List[WorkspaceMember]:
    return db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()

from ...modules.captures.models import Capture

def get_workspace_captures(db: Session, workspace_id: UUID) -> List[Capture]:
    return db.query(Capture).join(SharedCapture, Capture.id == SharedCapture.capture_id).filter(
        SharedCapture.workspace_id == workspace_id,
        Capture.deleted_at == None
    ).order_by(Capture.created_at.desc()).all()

def remove_workspace_member(db: Session, user: User, workspace_id: UUID, target_user_id: UUID):
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == target_user_id
    ).first()
    if member:
        db.delete(member)
        
        # Activity
        activity = WorkspaceActivity(
            workspace_id=workspace_id,
            actor_id=user.id,
            action="removed_member",
            entity_type="user",
            entity_id=str(target_user_id)
        )
        db.add(activity)
        db.commit()
    return True

import secrets
from datetime import datetime, timedelta
from .models import WorkspaceInvitation, SharedCapture
from . import schemas
def share_capture(db: Session, user: User, workspace_id: UUID, capture_id: UUID) -> SharedCapture:
    # Check if already shared
    existing = db.query(SharedCapture).filter(
        SharedCapture.workspace_id == workspace_id,
        SharedCapture.capture_id == capture_id
    ).first()
    
    if existing:
        return existing
        
    shared = SharedCapture(
        workspace_id=workspace_id,
        capture_id=capture_id,
        shared_by=user.id,
        permissions={}
    )
    db.add(shared)
    
    # Activity
    activity = WorkspaceActivity(
        workspace_id=workspace_id,
        actor_id=user.id,
        action="shared_capture",
        entity_type="capture",
        entity_id=str(capture_id)
    )
    db.add(activity)
    
    db.commit()
    db.refresh(shared)
    return shared

def create_invitation(db: Session, user: User, workspace_id: UUID, invitation_in: schemas.InvitationCreate) -> WorkspaceInvitation:
    # Basic setup, link generation
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(days=7)
    
    invitation = WorkspaceInvitation(
        workspace_id=workspace_id,
        invited_by=user.id,
        email=invitation_in.email,
        target_user_id=invitation_in.target_user_id,
        role=invitation_in.role,
        token=token,
        expires_at=expires_at
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation

def accept_invitation(db: Session, user: User, token: str) -> Workspace:
    # First try to match an 8-character workspace ID invite code
    if len(token) == 8:
        workspace = db.query(Workspace).filter(
            Workspace.id.cast(str).ilike(f"{token}%"),
            Workspace.deleted_at == None
        ).first()
        if workspace:
            # Check if already a member
            existing = db.query(WorkspaceMember).filter(
                WorkspaceMember.workspace_id == workspace.id,
                WorkspaceMember.user_id == user.id
            ).first()
            if existing:
                return workspace # Already in, just return it
                
            # Add as contributor by default for invite codes
            member = WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user.id,
                role=WorkspaceRole.CONTRIBUTOR
            )
            db.add(member)
            activity = WorkspaceActivity(
                workspace_id=workspace.id,
                actor_id=user.id,
                action="joined_workspace_via_code",
                entity_type="user",
                entity_id=str(user.id)
            )
            db.add(activity)
            db.commit()
            return workspace

    # Fallback to standard email token invitations
    invitation = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.token == token,
        WorkspaceInvitation.status == "pending"
    ).first()
    
    if not invitation:
        raise ValueError("Invalid invite code.")
        
    if invitation.expires_at and invitation.expires_at < datetime.now(invitation.expires_at.tzinfo):
        invitation.status = "expired"
        db.commit()
        raise ValueError("Invitation has expired.")
        
    # Mark accepted
    invitation.status = "accepted"
    
    # Add member
    member = WorkspaceMember(
        workspace_id=invitation.workspace_id,
        user_id=user.id,
        role=invitation.role
    )
    db.add(member)
    
    # Activity
    activity = WorkspaceActivity(
        workspace_id=invitation.workspace_id,
        actor_id=user.id,
        action="joined_workspace",
        entity_type="user",
        entity_id=str(user.id)
    )
    db.add(activity)
    
    db.commit()
    return get_workspace(db, invitation.workspace_id)

def get_invitations(db: Session, workspace_id: UUID) -> List[WorkspaceInvitation]:
    return db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.workspace_id == workspace_id,
        WorkspaceInvitation.status == "pending"
    ).all()

def revoke_invitation(db: Session, user: User, workspace_id: UUID, invitation_id: UUID) -> bool:
    invitation = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.id == invitation_id,
        WorkspaceInvitation.workspace_id == workspace_id
    ).first()
    
    if invitation and invitation.status == "pending":
        invitation.status = "revoked"
        
        activity = WorkspaceActivity(
            workspace_id=workspace_id,
            actor_id=user.id,
            action="revoked_invitation",
            entity_type="invitation",
            entity_id=str(invitation_id)
        )
        db.add(activity)
        db.commit()
        return True
    return False

def delete_workspace(db: Session, user: User, workspace_id: UUID) -> bool:
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        return False
        
    workspace.deleted_at = datetime.now()
    
    # Soft delete all members
    members = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()
    for member in members:
        db.delete(member)
        
    activity = WorkspaceActivity(
        workspace_id=workspace.id,
        actor_id=user.id,
        action="deleted_workspace",
        entity_type="workspace",
        entity_id=str(workspace.id)
    )
    db.add(activity)
    db.commit()
    return True

def leave_workspace(db: Session, user: User, workspace_id: UUID) -> bool:
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user.id
    ).first()
    
    if not member:
        return False
        
    if member.role == WorkspaceRole.OWNER:
        raise ValueError("Owners cannot leave the workspace. You must delete the workspace instead.")
        
    db.delete(member)
    
    activity = WorkspaceActivity(
        workspace_id=workspace_id,
        actor_id=user.id,
        action="left_workspace",
        entity_type="user",
        entity_id=str(user.id)
    )
    db.add(activity)
    db.commit()
    return True
