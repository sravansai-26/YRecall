import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), '04_Development', 'backend'))

from app.core.config import settings
from supabase import create_client, Client

def main():
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    
    try:
        bucket = supabase.storage.get_bucket("captures")
        print("Bucket 'captures' already exists:", bucket)
    except Exception as e:
        print(f"Bucket 'captures' not found, creating... Error: {e}")
        try:
            res = supabase.storage.create_bucket("captures", options={"public": True})
            print(f"Bucket created: {res}")
        except Exception as e2:
            print(f"Failed to create bucket: {e2}")

if __name__ == "__main__":
    main()
