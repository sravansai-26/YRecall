from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

class GraphNode(BaseModel):
    id: str
    name: str
    type: str
    description: Optional[str] = None
    group: int = 1 # Used for D3 coloring

class GraphLink(BaseModel):
    source: str # ID of source node
    target: str # ID of target node
    value: int = 1 # Weight / confidence
    type: str

class GraphNetwork(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]

class EntityDetail(BaseModel):
    id: uuid.UUID
    name: str
    type: str
    description: Optional[str] = None
    created_at: datetime
    
    # Simple list of connected entities
    connections: List[dict] # {"entity_id": ..., "name": ..., "relationship_type": ...}

class GraphSettingsBase(BaseModel):
    # AI Relationship Engine
    auto_relationship_discovery: Optional[bool] = None
    auto_entity_linking: Optional[bool] = None
    relationship_confidence_threshold: Optional[float] = None
    background_updates: Optional[bool] = None
    smart_entity_merging: Optional[bool] = None
    semantic_linking: Optional[bool] = None
    relationship_suggestions: Optional[bool] = None

    # Entity Preferences
    auto_merge_similar: Optional[bool] = None
    alias_recognition: Optional[bool] = None
    case_sensitive: Optional[bool] = None
    
    # Search Configuration
    search_type: Optional[str] = None
    relationship_depth: Optional[int] = None
    similarity_threshold: Optional[float] = None
    
    # Graph Privacy
    include_workspace_graphs: Optional[bool] = None
    hide_sensitive_entities: Optional[bool] = None
    
    # AI Explainability
    show_relationship_reasons: Optional[bool] = None
    show_confidence_scores: Optional[bool] = None
    show_source_memories: Optional[bool] = None

class GraphSettingsUpdate(GraphSettingsBase):
    pass

class GraphSettingsResponse(GraphSettingsBase):
    id: uuid.UUID
    user_id: str
    
    model_config = {"from_attributes": True}
