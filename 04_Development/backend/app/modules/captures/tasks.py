from google import genai
from sqlalchemy.orm import Session
from uuid import UUID
from ...core.config import settings
from ..ai.models import AIEmbedding
import traceback

def generate_and_store_embedding(db: Session, capture_id: UUID, text: str):
    """
    Generates an embedding for the given text using Gemini and stores it in the DB.
    """
    if not settings.GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not set. Skipping embedding generation.")
        return
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # Call Gemini embedding model
        result = client.models.embed_content(
            model="models/gemini-embedding-2",
            contents=text
        )
        
        embedding_vector = result.embeddings[0].values
        
        if not embedding_vector or len(embedding_vector) != 3072:
            raise ValueError(f"Invalid embedding dimension. Expected 3072, got {len(embedding_vector) if embedding_vector else 0}")
            
        # Store in db
        ai_embedding = AIEmbedding(
            capture_id=capture_id,
            embedding=embedding_vector
        )
        db.add(ai_embedding)
        db.commit()
    except Exception as e:
        print(f"Error generating embedding for capture {capture_id}: {e}")
        traceback.print_exc()
        db.rollback()
