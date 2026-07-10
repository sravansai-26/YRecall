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
