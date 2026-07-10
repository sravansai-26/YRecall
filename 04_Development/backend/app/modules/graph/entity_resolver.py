import json
import asyncio
from sqlalchemy.orm import Session
from google import genai

from ...core.config import settings
from ..captures.models import Capture
from .models import Entity, Relationship

client = genai.Client(api_key=settings.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

def resolve_entities_and_relationships(db: Session, capture_id: str, user_id: str):
    """
    Synchronously run extraction (designed to be called inside a background task or worker).
    """
    capture = db.query(Capture).filter(Capture.id == capture_id, Capture.user_id == user_id).first()
    if not capture:
        return

    content = f"Title: {capture.title}\nSummary: {capture.summary}\nContent: {capture.content_text}"

    prompt = f"""
    You are a Knowledge Graph extraction engine. Extract entities and their relationships from the following text.
    
    Entities can be: Person, Organization, Location, Project, Technology, Concept, Event, Document, etc.
    Relationships connect two extracted entities (e.g., WORKS_ON, LOCATED_AT, RELATED_TO, CREATED).
    
    Output JSON exactly in this format:
    {{
        "entities": [
            {{"name": "John Doe", "type": "Person", "description": "Software Engineer"}},
            {{"name": "YRecall", "type": "Project", "description": "Second Brain App"}}
        ],
        "relationships": [
            {{"source": "John Doe", "target": "YRecall", "type": "WORKS_ON", "confidence": 0.95}}
        ]
    }}
    
    TEXT TO ANALYZE:
    {content}
    """
    
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    
    text = response.text
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
        
    data = json.loads(text)
    
    # 1. Process Entities
    entity_map = {} # name -> Entity.id
    
    for ent_data in data.get("entities", []):
        name = ent_data.get("name")
        if not name: continue
        
        # Check if exists (simple exact match for now, or alias match)
        existing = db.query(Entity).filter(Entity.user_id == user_id, Entity.name.ilike(name)).first()
        if existing:
            entity_map[name] = existing.id
        else:
            new_ent = Entity(
                user_id=user_id,
                name=name,
                type=ent_data.get("type", "Unknown"),
                description=ent_data.get("description", "")
            )
            db.add(new_ent)
            db.flush() # Get ID immediately
            entity_map[name] = new_ent.id
            
    # 2. Process Relationships
    for rel_data in data.get("relationships", []):
        src_name = rel_data.get("source")
        tgt_name = rel_data.get("target")
        
        src_id = entity_map.get(src_name)
        tgt_id = entity_map.get(tgt_name)
        
        if src_id and tgt_id:
            # Check if relationship already exists between these two from this capture
            existing_rel = db.query(Relationship).filter(
                Relationship.source_entity_id == src_id,
                Relationship.target_entity_id == tgt_id,
                Relationship.source_capture_id == capture.id
            ).first()
            
            if not existing_rel:
                new_rel = Relationship(
                    source_entity_id=src_id,
                    target_entity_id=tgt_id,
                    relationship_type=rel_data.get("type", "RELATED_TO"),
                    confidence=rel_data.get("confidence", 1.0),
                    source_capture_id=capture.id
                )
                db.add(new_rel)
                
    db.commit()

from ...core.database import SessionLocal

async def async_extract_with_retry(capture_id: str, user_id: str, max_retries: int = 3):
    """
    Async wrapper for BackgroundTasks that retries if extraction fails.
    """
    attempt = 0
    while attempt < max_retries:
        try:
            from fastapi.concurrency import run_in_threadpool
            
            def run_sync():
                db = SessionLocal()
                try:
                    resolve_entities_and_relationships(db, capture_id, user_id)
                finally:
                    db.close()
                    
            await run_in_threadpool(run_sync)
            break
        except Exception as e:
            attempt += 1
            print(f"Extraction failed for {capture_id}, attempt {attempt}/{max_retries}. Error: {e}")
            if attempt >= max_retries:
                break
            await asyncio.sleep(2 ** attempt)
