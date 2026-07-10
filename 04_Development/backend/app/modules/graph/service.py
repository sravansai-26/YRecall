from sqlalchemy.orm import Session
import uuid
from typing import Optional
from .models import Entity, Relationship
from .schemas import GraphNetwork, GraphNode, GraphLink, EntityDetail

def get_network(db: Session, user_id: str) -> dict:
    entities = db.query(Entity).filter(Entity.user_id == user_id).all()
    relationships = db.query(Relationship).join(
        Entity, Relationship.source_entity_id == Entity.id
    ).filter(Entity.user_id == user_id).all()
    
    nodes = []
    # Assign groups based on type
    type_groups = {}
    current_group = 1
    
    for ent in entities:
        if ent.type not in type_groups:
            type_groups[ent.type] = current_group
            current_group += 1
            
        nodes.append({
            "id": str(ent.id),
            "name": ent.name,
            "type": ent.type,
            "description": ent.description,
            "group": type_groups[ent.type]
        })
        
    links = []
    for rel in relationships:
        links.append({
            "source": str(rel.source_entity_id),
            "target": str(rel.target_entity_id),
            "value": 1,
            "type": rel.relationship_type
        })
        
    return {"nodes": nodes, "links": links}


def get_entity(db: Session, user_id: str, entity_id: uuid.UUID) -> Optional[dict]:
    entity = db.query(Entity).filter(Entity.id == entity_id, Entity.user_id == user_id).first()
    if not entity:
        return None
        
    # Get connections
    source_rels = db.query(Relationship).filter(Relationship.source_entity_id == entity.id).all()
    target_rels = db.query(Relationship).filter(Relationship.target_entity_id == entity.id).all()
    
    connections = []
    for rel in source_rels:
        tgt = db.query(Entity).filter(Entity.id == rel.target_entity_id).first()
        if tgt:
            connections.append({
                "entity_id": str(tgt.id),
                "name": tgt.name,
                "relationship_type": rel.relationship_type,
                "direction": "out"
            })
            
    for rel in target_rels:
        src = db.query(Entity).filter(Entity.id == rel.source_entity_id).first()
        if src:
            connections.append({
                "entity_id": str(src.id),
                "name": src.name,
                "relationship_type": rel.relationship_type,
                "direction": "in"
            })
            
    return {
        "id": entity.id,
        "name": entity.name,
        "type": entity.type,
        "description": entity.description,
        "created_at": entity.created_at,
        "connections": connections
    }
