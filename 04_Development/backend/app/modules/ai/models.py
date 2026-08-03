import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from ...core.database import Base
from ...modules.collaboration.models import Workspace # Required for FK resolution

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String, nullable=True)
    is_pinned = Column(Boolean, default=False, server_default="false", nullable=False)
    is_archived = Column(Boolean, default=False, server_default="false", nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String, nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    status = Column(String, default="completed", server_default="completed", nullable=False)
    attachments = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIEmbedding(Base):
    __tablename__ = "ai_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), nullable=True, index=True)
    message_id = Column(UUID(as_uuid=True), ForeignKey("ai_messages.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # 3072 dimensions for Gemini embedding 2
    embedding = Column(Vector(3072), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIJob(Base):
    __tablename__ = "ai_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="CASCADE"), nullable=True, index=True)
    job_type = Column(String, nullable=False, index=True) # e.g., 'enrichment', 'graph_reconciliation'
    status = Column(String, default="QUEUED", nullable=False, index=True) # QUEUED, RUNNING, RETRYING, WAITING_RATE_LIMIT, FAILED, COMPLETED, CANCELLED
    
    attempt_count = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    next_retry_at = Column(DateTime(timezone=True), nullable=True, index=True)
    
    provider_used = Column(String, nullable=True)
    model_used = Column(String, nullable=True)
    execution_duration_ms = Column(Integer, nullable=True)
    error_detail = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
