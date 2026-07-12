import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ...core.database import Base

class WorkspaceRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    CONTRIBUTOR = "contributor"
    VIEWER = "viewer"

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    visibility = Column(String, default="private") # private, shared, public
    color = Column(String, nullable=True)
    theme_color = Column(String, nullable=True)
    background_image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    # Relationships
    members = relationship("WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan")
    shared_captures = relationship("SharedCapture", back_populates="workspace", cascade="all, delete-orphan")
    invitations = relationship("WorkspaceInvitation", back_populates="workspace", cascade="all, delete-orphan")


class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Enum(WorkspaceRole), default=WorkspaceRole.VIEWER)
    
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User") # Assuming User model is globally available


class SharedCapture(Base):
    """
    Maps a Capture to a Workspace, enabling shared timelines.
    """
    __tablename__ = "shared_captures"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id"), nullable=False)
    shared_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    permissions = Column(JSON, default=dict) # e.g. {"can_edit": ["editor", "admin"]}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="shared_captures")
    capture = relationship("Capture")
    user = relationship("User")


class WorkspaceInvitation(Base):
    __tablename__ = "workspace_invitations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    invited_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    email = Column(String, nullable=True)
    target_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # If explicitly targeting a known user
    role = Column(Enum(WorkspaceRole), default=WorkspaceRole.VIEWER)
    status = Column(String, default="pending") # pending, accepted, declined, revoked
    
    token = Column(String, nullable=True, unique=True) # for share links
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="invitations")


class WorkspaceActivity(Base):
    __tablename__ = "workspace_activity"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    action = Column(String, nullable=False) # e.g. "uploaded_capture", "commented", "invited_user"
    entity_type = Column(String, nullable=True) # "capture", "comment", "member"
    entity_id = Column(String, nullable=True)
    
    metadata_json = Column(JSON, default=dict) # Use metadata_json to avoid conflict with SQLAlchemy metadata
    
    created_at = Column(DateTime, default=datetime.utcnow)
