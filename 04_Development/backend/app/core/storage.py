from supabase import create_client, Client
from app.core.config import settings
import uuid
import mimetypes

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

BUCKET_NAME = "captures"

def upload_file_to_storage(file_bytes: bytes, filename: str, content_type: str, user_id: str) -> str:
    """
    Uploads a file to Supabase Storage and returns the public URL.
    """
    # Create a unique path: user_id/uuid_filename
    unique_id = str(uuid.uuid4())
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[1]
    
    storage_path = f"{user_id}/{unique_id}{ext}"
    
    # Ensure bucket exists (optional if already created via Supabase console)
    try:
        supabase.storage.get_bucket(BUCKET_NAME)
    except Exception:
        try:
            supabase.storage.create_bucket(BUCKET_NAME, options={"public": True})
        except Exception:
            pass

    res = supabase.storage.from_(BUCKET_NAME).upload(
        file=file_bytes,
        path=storage_path,
        file_options={"content-type": content_type}
    )
    
    # Get public URL
    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
    return public_url
