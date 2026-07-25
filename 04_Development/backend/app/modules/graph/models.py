import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, JSON, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship

from ...core.database import Base

class Entity(Base):
    __tablename__ = "entities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False) # e.g. Person, Organization, Location, Project
    description = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    source_relations = relationship("Relationship", foreign_keys="Relationship.source_entity_id", back_populates="source_entity")
    target_relations = relationship("Relationship", foreign_keys="Relationship.target_entity_id", back_populates="target_entity")
    aliases = relationship("EntityAlias", back_populates="entity", cascade="all, delete-orphan")


class Relationship(Base):
    __tablename__ = "relationships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_entity_id = Column(UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    target_entity_id = Column(UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    relationship_type = Column(String, nullable=False) # e.g. WORKS_ON, LOCATED_AT
    confidence = Column(Float, default=1.0)
    source_capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    source_entity = relationship("Entity", foreign_keys=[source_entity_id], back_populates="source_relations")
    target_entity = relationship("Entity", foreign_keys=[target_entity_id], back_populates="target_relations")


class EntityAlias(Base):
    __tablename__ = "entity_aliases"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_id = Column(UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False)
    alias_name = Column(String, nullable=False, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    entity = relationship("Entity", back_populates="aliases")


class EntityEmbedding(Base):
    __tablename__ = "entity_embeddings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_id = Column(UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False, unique=True)
    embedding = Column(Vector(768)) # Assuming gemini embeddings size
    
    created_at = Column(DateTime, default=datetime.utcnow)

class GraphSettings(Base):
    __tablename__ = "graph_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, unique=True, index=True, nullable=False)
    
    # AI Relationship Engine
    auto_relationship_discovery = Column(Boolean, default=True)
    auto_entity_linking = Column(Boolean, default=True)
    relationship_confidence_threshold = Column(Float, default=0.7)
    background_updates = Column(Boolean, default=True)
    smart_entity_merging = Column(Boolean, default=False)
    semantic_linking = Column(Boolean, default=True)
    relationship_suggestions = Column(Boolean, default=True)

    # Entity Preferences
    auto_merge_similar = Column(Boolean, default=False)
    alias_recognition = Column(Boolean, default=True)
    case_sensitive = Column(Boolean, default=False)
    
    # Search Configuration
    search_type = Column(String, default="hybrid")
    relationship_depth = Column(Integer, default=2)
    similarity_threshold = Column(Float, default=0.75)
    
    # Graph Privacy
    include_workspace_graphs = Column(Boolean, default=False)
    hide_sensitive_entities = Column(Boolean, default=True)
    
    # AI Explainability
    show_relationship_reasons = Column(Boolean, default=True)
    show_confidence_scores = Column(Boolean, default=False)
    show_source_memories = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
