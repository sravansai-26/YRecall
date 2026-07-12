import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from ...core.database import Base

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
