import google.generativeai as genai
from sqlalchemy.orm import Session
from uuid import UUID
from ...core.config import settings
from ..ai.models import AIEmbedding

def generate_and_store_embedding(db: Session, capture_id: UUID, text: str):
    """
    Generates an embedding for the given text using Gemini and stores it in the DB.
    """
    if not settings.GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not set. Skipping embedding generation.")
        return
        
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Call Gemini embedding model
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        
        embedding_vector = result['embedding']
        
        # Store in db
        ai_embedding = AIEmbedding(
            capture_id=capture_id,
            embedding=embedding_vector
        )
        db.add(ai_embedding)
        db.commit()
    except Exception as e:
        print(f"Error generating embedding for capture {capture_id}: {e}")
        db.rollback()
