from google import genai
from sqlalchemy.orm import Session
from uuid import UUID
import traceback
import requests
from bs4 import BeautifulSoup
import httpx

from ...core.config import settings
from ..ai.models import AIEmbedding
from .models import Capture, CaptureURL, CaptureLocation, CaptureMedia

def generate_and_store_embedding(db: Session, capture_id: UUID, text: str):
    """
    Generates an embedding for the given text using Gemini and stores it in the DB.
    """
    if not settings.GEMINI_API_KEY or not text:
        return
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        result = client.models.embed_content(
            model="models/gemini-embedding-2",
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
            
            author_meta = soup.find("meta", name="author")
            author = author_meta["content"] if author_meta else None
            
            # Update DB
            capture.title = title
            url_meta.domain = url.split("//")[-1].split("/")[0]
            url_meta.og_image = image_url
            url_meta.author = author
            
            # Use text content as the main text
            text_content = ' '.join(soup.stripped_strings)[:2000] # Limit to 2000 chars for embedding
            capture.content_text = f"{title}\n{desc}\n{text_content}"
            capture.status = "completed"
            
            db.commit()
            
            # Generate embedding
            generate_and_store_embedding(db, capture.id, capture.content_text)
            
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
            
        capture.content_text = f"Location capture at Latitude: {loc_meta.latitude}, Longitude: {loc_meta.longitude}"
        capture.title = "Saved Location"
        capture.status = "completed"
        db.commit()
        
        generate_and_store_embedding(db, capture.id, capture.content_text)
        
    except Exception as e:
        print(f"Error processing Location capture {capture_id}: {e}")

def process_media_capture(db: Session, capture_id: UUID):
    """
    Uses Gemini to extract text/summary from images and audio.
    """
    try:
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        media_meta = db.query(CaptureMedia).filter(CaptureMedia.capture_id == capture_id).first()
        if not capture or not media_meta or not settings.GEMINI_API_KEY:
            if capture:
                capture.status = "completed"
                db.commit()
            return
            
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # Download the file from Supabase public URL to process it via Gemini API
        file_content = None
        if capture.file_url:
            resp = httpx.get(capture.file_url, timeout=30.0)
            if resp.status_code == 200:
                file_content = resp.content
        
        extracted_text = ""
        summary = ""
        
        if file_content:
            mime = capture.mime_type
            try:
                # If image, ask Gemini to describe it
                if mime and mime.startswith('image'):
                    response = client.models.generate_content(
                        model='models/gemini-2.5-flash',
                        contents=[
                            {'mime_type': mime, 'data': file_content},
                            'Describe this image in detail and extract any text present in it.'
                        ]
                    )
                    extracted_text = response.text
                    summary = "Image Description"
                
                # If audio, ask Gemini to transcribe
                elif mime and (mime.startswith('audio') or mime.startswith('video')):
                    response = client.models.generate_content(
                        model='models/gemini-2.5-flash',
                        contents=[
                            {'mime_type': mime, 'data': file_content},
                            'Please provide a full transcript of this audio/video, and then a brief summary.'
                        ]
                    )
                    extracted_text = response.text
                    summary = "Audio Transcript & Summary"
                    
                # If document/pdf
                elif mime and 'pdf' in mime:
                    response = client.models.generate_content(
                        model='models/gemini-2.5-flash',
                        contents=[
                            {'mime_type': mime, 'data': file_content},
                            'Extract the main text and summarize the document.'
                        ]
                    )
                    extracted_text = response.text
                    summary = "Document Summary"
                    
            except Exception as e:
                print(f"Gemini processing error: {e}")
                
        capture.content_text = extracted_text
        capture.title = summary or f"{capture.type.capitalize()} Capture"
        capture.status = "completed"
        
        # Update OCR/transcript fields in base model or metadata model
        capture.ocr_text = extracted_text
        
        db.commit()
        
        if extracted_text:
            generate_and_store_embedding(db, capture.id, extracted_text)
            
    except Exception as e:
        print(f"Error processing Media capture {capture_id}: {e}")
        traceback.print_exc()
        capture = db.query(Capture).filter(Capture.id == capture_id).first()
        if capture:
            capture.status = "error"
            db.commit()
