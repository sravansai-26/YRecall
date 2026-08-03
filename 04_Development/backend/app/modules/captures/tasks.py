import logging
import traceback
import requests
import httpx
from bs4 import BeautifulSoup
from uuid import UUID
from sqlalchemy.orm import Session

from ...core.config import settings
from ..ai.models import AIEmbedding, AIJob
from .models import Capture, CaptureURL, CaptureLocation, CaptureMedia
from ...core.ai.router import ai_router

logger = logging.getLogger(__name__)

def generate_and_store_embedding(db: Session, capture_id: UUID, text: str):
    """
    Generates an embedding for the given text using the router and stores it in the DB.
    """
    if not text:
        return
        
    try:
        embedding_vector = ai_router.generate_embedding(text)
        
        ai_embedding = AIEmbedding(
            capture_id=capture_id,
            embedding=embedding_vector
        )
        db.add(ai_embedding)
        db.commit()
    except Exception as e:
        logger.error(f"Error generating embedding for capture {capture_id}: {e}")
        db.rollback()

def _extract_raw_content(db: Session, capture: Capture) -> str:
    """
    Extracts raw text content from the capture or its associated media/URL.
    """
    if capture.type in ["text", "note"]:
        return capture.content_text or ""
        
    elif capture.type == "url":
        url_meta = db.query(CaptureURL).filter(CaptureURL.capture_id == capture.id).first()
        if not url_meta:
            return ""
            
        url = url_meta.original_url
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Save metadata if missing
            title = soup.title.string if soup.title else None
            if not title:
                og_title = soup.find("meta", property="og:title")
                title = og_title["content"] if og_title else url
                
            og_image = soup.find("meta", property="og:image")
            url_meta.og_image = og_image["content"] if og_image else None
            
            author_meta = soup.find("meta", attrs={"name": "author"})
            url_meta.author = author_meta["content"] if author_meta else None
            url_meta.domain = url.split("//")[-1].split("/")[0]
            
            if not capture.title:
                capture.title = title
            
            raw_text = ' '.join(soup.stripped_strings)[:8000]
            capture.content_text = raw_text
            db.commit()
            return raw_text
            
    elif capture.type == "location":
        loc_meta = db.query(CaptureLocation).filter(CaptureLocation.capture_id == capture.id).first()
        if not loc_meta:
            return ""
            
        raw_loc = f"Latitude: {loc_meta.latitude}, Longitude: {loc_meta.longitude}"
        if loc_meta.city and loc_meta.country:
            raw_loc += f", {loc_meta.city}, {loc_meta.country}"
        
        capture.content_text = raw_loc
        db.commit()
        return raw_loc
        
    return ""

def process_ai_enrichment_job(db: Session, job: AIJob):
    """
    Unified AI enrichment pipeline.
    Runs once per capture, extracting all metadata and generating embeddings.
    Returns (provider, model) used for the enrichment.
    """
    capture = db.query(Capture).filter(Capture.id == job.capture_id).first()
    if not capture:
        raise ValueError(f"Capture {job.capture_id} not found")

    provider = "groq"
    model = getattr(settings, "BACKGROUND_MODEL", "mixtral-8x7b-32768")

    # 1. Extract raw content
    raw_content = _extract_raw_content(db, capture)
    
    # 2. Extract media bytes if it's a media capture
    file_bytes = None
    if capture.type in ["image", "video", "audio", "document", "pdf", "screenshot", "voice"]:
        if capture.file_url:
            resp = httpx.get(capture.file_url, timeout=30.0)
            if resp.status_code == 200:
                file_bytes = resp.content

    # 3. Generate Enrichment
    try:
        supported_vision_types = ["image/", "video/", "audio/", "application/pdf"]
        is_vision_supported = any((capture.mime_type or "").startswith(t) for t in supported_vision_types)

        if file_bytes and is_vision_supported:
            prompt = """
            Analyze this media carefully. Return a JSON object with the following structure:
            {
                "title": "A short, descriptive 3-6 word title (leave empty if not applicable)",
                "outer_summary": "A brief 1-2 sentence summary of the main subject",
                "inner_summary": "A comprehensive, detailed paragraph describing everything in depth",
                "transcript": "Full audio transcript if spoken (leave empty if none)",
                "ocr_text": "Any readable text found visually (leave empty if none)",
                "keywords": ["list", "of", "keywords"],
                "tags": ["list", "of", "tags"],
                "entities": [{"name": "entity name", "type": "person/organization/location/concept"}]
            }
            Ensure the output is valid JSON. Do not include markdown formatting.
            """
            
            data = ai_router.generate_vision(
                task="background",
                prompt=prompt,
                file_bytes=file_bytes,
                mime_type=capture.mime_type or "application/octet-stream",
                expect_json=True
            )
            provider = "gemini"
            model = "gemini-2.5-flash"
            
        else:
            prompt = f"""
            Analyze the following captured text.
            Provide a JSON object with the following structure:
            {{
                "title": "A short, descriptive 3-6 word title",
                "outer_summary": "A brief 1-2 sentence summary of the main subject",
                "inner_summary": "A comprehensive, detailed paragraph describing the content",
                "keywords": ["list", "of", "keywords"],
                "tags": ["list", "of", "tags"],
                "entities": [{{"name": "entity name", "type": "person/organization/location/concept"}}]
            }}
            
            TEXT:
            {raw_content[:8000]}
            """
            data = ai_router.generate_json(task="background", prompt=prompt)
            provider_name = getattr(settings, "BACKGROUND_AI_PROVIDER", "groq")
            provider = provider_name
            
        # 4. Map outputs to dedicated enrichment columns (Never mutate content_text here)
        if not capture.title and data.get("title"):
            capture.title = data.get("title")
            
        capture.outer_summary = data.get("outer_summary", "")
        capture.inner_summary = data.get("inner_summary", "")
        capture.summary = data.get("outer_summary", "") # Fallback mapping
        capture.ai_tags = data.get("tags", [])
        capture.ai_entities = data.get("entities", [])
        
        if data.get("transcript"):
            capture.transcript = data.get("transcript")
        if data.get("ocr_text"):
            capture.ocr_text = data.get("ocr_text")
            
        capture.status = "completed"
        db.commit()
        
        # 5. Generate Embedding
        # We embed a rich combination of the original content and the summaries
        embed_text = f"{capture.title}\n{capture.outer_summary}\n{capture.inner_summary}\n{raw_content}"
        generate_and_store_embedding(db, capture.id, embed_text)
        
    except Exception as e:
        capture.status = "pending_ai"
        db.commit()
        raise e

    return provider, model
