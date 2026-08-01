from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from uuid import UUID
import traceback
import requests
from bs4 import BeautifulSoup
import httpx
import json

from ...core.config import settings
from ..ai.models import AIEmbedding
from .models import Capture, CaptureURL, CaptureLocation, CaptureMedia
from ...core.ai.router import ai_router

def generate_and_store_embedding(db: Session, capture_id: UUID, text: str):
    """
    Generates an embedding for the given text using Gemini and stores it in the DB.
    """
    if not settings.GEMINI_API_KEY or not text:
        return
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        result = client.models.embed_content(
            model="gemini-embedding-2",
            contents=text
        )
        
        embedding_vector = result.embeddings[0].values
        
        ai_embedding = AIEmbedding(
            capture_id=capture_id,
            embedding=embedding_vector
        )
        db.add(ai_embedding)
        db.commit()
    except Exception as e:
        print(f"Error generating embedding for capture {capture_id}: {e}")
        db.rollback()
        # Graceful failure: capture succeeds even if embedding fails
        pass

def process_url_capture(db: Session, capture_id: UUID):
    """
    Fetches OG tags, summary and generates embeddings.
    """
    try:
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        url_meta = db.query(CaptureURL).filter(CaptureURL.capture_id == capture_id).first()
        if not capture or not url_meta:
            return
            
        url = url_meta.original_url
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            title = soup.title.string if soup.title else None
            if not title:
                og_title = soup.find("meta", property="og:title")
                title = og_title["content"] if og_title else url
                
            og_image = soup.find("meta", property="og:image")
            image_url = og_image["content"] if og_image else None
            
            og_desc = soup.find("meta", property="og:description")
            desc = og_desc["content"] if og_desc else None
            
            author_meta = soup.find("meta", attrs={"name": "author"})
            author = author_meta["content"] if author_meta else None
            
            # Update DB
            capture.title = title
            url_meta.domain = url.split("//")[-1].split("/")[0]
            url_meta.og_image = image_url
            url_meta.author = author
            
            # Extract text to send to AI
            raw_text = ' '.join(soup.stripped_strings)[:4000] 
            
            prompt = f"""
            Analyze the following text extracted from a URL ({url}).
            Provide a concise, descriptive title (max 6 words), a short summary (1-2 sentences), and a detailed summary (1 paragraph).
            Format the output as a JSON object:
            {{
                "title": "your title",
                "summary": "your short summary (outer)",
                "detailed_summary": "your detailed summary (inner)"
            }}
            
            TEXT:
            {raw_text}
            """
            
            try:
                data = ai_router.generate_json(task="background", prompt=prompt)
                
                if not title or title == url:
                    capture.title = data.get("title", title)
                else:
                    capture.title = title
                    
                capture.summary = data.get("summary", "")
                detailed_summary = data.get("detailed_summary", "")
                
                if detailed_summary:
                    capture.content_text = f"### Detailed Summary\n\n{detailed_summary}"
                else:
                    capture.content_text = f"{title}\n{desc}" if desc else title
                    
            except Exception as e:
                print(f"AI Router processing error for URL: {e}")
                capture.title = title
                capture.content_text = f"{title}\n{desc}" if desc else title
                
            capture.status = "completed"
            
            db.commit()
            
            # Generate embedding
            generate_and_store_embedding(db, capture.id, f"{capture.title}\n{capture.summary}\n{capture.content_text}")
            
    except Exception as e:
        print(f"Error processing URL capture {capture_id}: {e}")
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        if capture:
            capture.status = "error"
            db.commit()

def process_location_capture(db: Session, capture_id: UUID):
    """
    Process location into text and embed.
    """
    try:
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        loc_meta = db.query(CaptureLocation).filter(CaptureLocation.capture_id == capture_id).first()
        if not capture or not loc_meta:
            return
            
        raw_loc = f"Latitude: {loc_meta.latitude}, Longitude: {loc_meta.longitude}"
        if loc_meta.city and loc_meta.country:
            raw_loc += f", {loc_meta.city}, {loc_meta.country}"
            
        prompt = f"""
        Analyze this location capture.
        Provide a concise, descriptive title (max 6 words), a short summary (1-2 sentences), and a detailed summary (1 paragraph) about this location.
        Format the output as a JSON object:
        {{
            "title": "your title",
            "summary": "your short summary (outer)",
            "detailed_summary": "your detailed summary (inner)"
        }}
        
        LOCATION INFO:
        {raw_loc}
        """
        
        try:
            data = ai_router.generate_json(task="background", prompt=prompt)
            capture.title = data.get("title", "Saved Location")
            capture.summary = data.get("summary", "")
            detailed_summary = data.get("detailed_summary", "")
            
            if detailed_summary:
                capture.content_text = f"### Detailed Summary\n\n{detailed_summary}"
            else:
                capture.content_text = raw_loc
        except Exception as e:
            print(f"AI Router processing error for Location: {e}")
            capture.content_text = raw_loc
            capture.title = "Saved Location"
            
        capture.status = "completed"
        db.commit()
        
        generate_and_store_embedding(db, capture.id, f"{capture.title}\n{capture.summary}\n{capture.content_text}")
        
    except Exception as e:
        print(f"Error processing Location capture {capture_id}: {e}")

def process_media_capture(db: Session, capture_id: UUID):
    """
    Uses AIRouter to extract text/summary from images and audio.
    """
    try:
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        media_meta = db.query(CaptureMedia).filter(CaptureMedia.capture_id == capture_id).first()
        if not capture or not media_meta:
            return
            
        file_content = None
        if capture.file_url:
            resp = httpx.get(capture.file_url, timeout=30.0)
            if resp.status_code == 200:
                file_content = resp.content
        
        extracted_text = ""
        summary = ""
        title = capture.title if capture.title else f"{capture.type.capitalize()} Capture"
        ocr_text = ""
        transcript = ""
        
        if file_content:
            mime = capture.mime_type
            try:
                prompt_text = """
                Analyze this media carefully. Extract all information and return exactly a JSON object (without markdown blocks) with the following structure:
                {
                    "title": "A short, descriptive 3-6 word title (ONLY if not already provided)",
                    "summary": "A brief 1-2 sentence summary of the main subject/action (outer summary)",
                    "detailed_summary": "A comprehensive, detailed paragraph describing everything in depth (inner summary)",
                    "transcript": "Full audio transcript if any audio is spoken (leave empty if none)",
                    "ocr_text": "Any readable text found visually in the media (leave empty if none)",
                    "detected_objects": ["list", "of", "objects"],
                    "detected_people": ["list", "of", "people/roles"],
                    "detected_places": ["list", "of", "places/settings"],
                    "keywords": ["list", "of", "keywords"],
                    "tags": ["list", "of", "tags"],
                    "suggested_category": "One category (e.g., Work, Personal, Inspiration, Receipt, Document)"
                }
                Make sure to provide valid JSON.
                """
                
                data = ai_router.generate_vision(
                    task="background",
                    prompt=prompt_text,
                    file_bytes=file_content,
                    mime_type=mime,
                    expect_json=True
                )
                
                # If user already set a title, don't overwrite it unless it's empty
                if not capture.title:
                    title = data.get("title", title)
                else:
                    title = capture.title
                    
                summary = data.get("summary", "")
                detailed_summary = data.get("detailed_summary", "")
                transcript = data.get("transcript", "")
                ocr_text = data.get("ocr_text", "")
                
                extracted_text = ""
                if detailed_summary: extracted_text += f"### Detailed Analysis\n\n{detailed_summary}\n\n"
                if transcript: extracted_text += f"### Transcript\n\n{transcript}\n\n"
                if ocr_text: extracted_text += f"### Scanned Text\n\n{ocr_text}\n\n"
                extracted_text += " ".join(data.get("keywords", []))
                
            except Exception as e:
                print(f"AI Router processing error: {e}")
                
        capture.content_text = extracted_text.strip()
        capture.title = title
        capture.summary = summary
        capture.transcript = transcript
        capture.ocr_text = ocr_text
        capture.status = "completed"
        
        db.commit()
        
        if extracted_text:
            generate_and_store_embedding(db, capture.id, extracted_text)
            
    except Exception as e:
        print(f"Error processing Media capture {capture_id}: {e}")
        traceback.print_exc()
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        if capture:
            capture.status = "pending_ai"
            db.commit()

def process_text_capture(db: Session, capture_id: UUID):
    """
    Uses AIRouter to generate a title and summary for raw text or note captures.
    """
    try:
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        if not capture or not capture.content_text:
            return
            
        prompt = f"""
        Analyze the following text or note.
        Provide a concise, descriptive title (max 6 words), a short summary (1-2 sentences), and a detailed summary (1 paragraph).
        Format the output as a JSON object:
        {{
            "title": "your title",
            "summary": "your short summary (outer)",
            "detailed_summary": "your detailed summary (inner)"
        }}
        
        TEXT:
        {capture.content_text[:4000]}
        """
        
        try:
            data = ai_router.generate_json(
                task="background",
                prompt=prompt
            )
            
            if not capture.title:
                capture.title = data.get("title", "")
            capture.summary = data.get("summary", "")
            detailed_summary = data.get("detailed_summary", "")
            
            if detailed_summary:
                capture.content_text = f"### Detailed Summary\n\n{detailed_summary}\n\n---\n\n{capture.content_text}"
        except Exception as e:
            print(f"AI Router processing error: {e}")
            
        capture.status = "completed"
        db.commit()
        
        # Generate embedding for the original text + new summary
        generate_and_store_embedding(db, capture.id, f"{capture.title}\n{capture.summary}\n{capture.content_text}")
        
    except Exception as e:
        print(f"Error processing Text capture {capture_id}: {e}")
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        if capture:
            capture.status = "pending_ai"
            db.commit()
