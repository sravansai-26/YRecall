from abc import ABC, abstractmethod
import os
import shutil
import uuid
from fastapi import UploadFile

class StorageProvider(ABC):
    @abstractmethod
    async def upload_file(self, file_path: str, destination_name: str) -> str:
        """Uploads a local file to the storage provider and returns a public/signed URL."""
        pass

    @abstractmethod
    async def download_file(self, url: str, local_destination: str) -> str:
        """Downloads a file from the storage provider to a local path."""
        pass

class LocalFileSystemProvider(StorageProvider):
    def __init__(self, base_dir: str = "/tmp/yrecall_exports"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    async def upload_file(self, file_path: str, destination_name: str) -> str:
        dest_path = os.path.join(self.base_dir, destination_name)
        shutil.copy2(file_path, dest_path)
        # Return just the filename so the backend can serve it via a download endpoint
        return destination_name

    async def download_file(self, url: str, local_destination: str) -> str:
        if url.startswith("file://"):
            source_path = url.replace("file://", "")
            shutil.copy2(source_path, local_destination)
            return local_destination
        raise ValueError("Invalid URL format for LocalFileSystemProvider")

class SupabaseProvider(StorageProvider):
    # Stub for future Supabase implementation
    async def upload_file(self, file_path: str, destination_name: str) -> str:
        # In a real implementation, this would use supabase-py to upload to a bucket
        raise NotImplementedError("Supabase upload not yet implemented")

    async def download_file(self, url: str, local_destination: str) -> str:
        raise NotImplementedError("Supabase download not yet implemented")

def get_storage_provider() -> StorageProvider:
    # Pluggable storage based on env
    provider_type = os.getenv("STORAGE_PROVIDER", "local")
    if provider_type == "supabase":
        return SupabaseProvider()
    return LocalFileSystemProvider()
