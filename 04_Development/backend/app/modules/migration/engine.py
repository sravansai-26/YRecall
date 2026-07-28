import os
import json
import zipfile
import tempfile
from datetime import datetime
from sqlalchemy.orm import Session
from uuid import UUID
import asyncio

from ...core.database import SessionLocal
from .models import MigrationJob
from .storage import get_storage_provider
from ..captures.models import Capture
from ..users.models import User

async def execute_export_task(job_id: UUID):
    """Background task to generate an export package."""
    db = SessionLocal()
    job = db.query(MigrationJob).filter(MigrationJob.id == job_id).first()
    if not job:
        db.close()
        return

    try:
        job.status = "running"
        job.current_stage = "initializing"
        job.started_at = datetime.utcnow()
        db.commit()

        user = db.query(User).filter(User.id == job.user_id).first()
        categories = job.categories
        
        export_data = {}
        total_items = 0

        # Export logic
        if "memories" in categories or "all" in categories:
            job.current_stage = "querying_memories"
            db.commit()
            captures = db.query(Capture).filter(Capture.user_id == user.id).all()
            export_data["captures"] = [
                {
                    "id": str(c.id),
                    "title": c.title,
                    "type": c.type,
                    "content": c.content_text,
                    "summary": c.summary,
                    "created_at": c.created_at.isoformat() if c.created_at else None,
                } for c in captures
            ]
            total_items += len(captures)

        job.total_items = total_items
        job.processed_items = total_items
        job.current_stage = "packaging"
        job.progress_percentage = 50.0
        db.commit()

        # Create temporary file
        provider = get_storage_provider()
        with tempfile.TemporaryDirectory() as tmpdir:
            if job.archive_format == "JSON":
                file_name = f"export_{job_id}.json"
                file_path = os.path.join(tmpdir, file_name)
                with open(file_path, "w") as f:
                    json.dump(export_data, f, indent=2)
            else:
                # Default ZIP
                file_name = f"export_{job_id}.zip"
                file_path = os.path.join(tmpdir, file_name)
                json_path = os.path.join(tmpdir, "data.json")
                with open(json_path, "w") as f:
                    json.dump(export_data, f, indent=2)
                
                with zipfile.ZipFile(file_path, "w", zipfile.ZIP_DEFLATED) as zf:
                    zf.write(json_path, "data.json")

            job.current_stage = "uploading"
            job.progress_percentage = 90.0
            db.commit()

            # Upload to storage
            file_url = await provider.upload_file(file_path, file_name)
            
            job.file_url = file_url
            job.file_size_bytes = os.path.getsize(file_path)
            
        job.status = "completed"
        job.current_stage = "finished"
        job.progress_percentage = 100.0
        job.completed_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        job.status = "failed"
        job.error_log = str(e)
        job.completed_at = datetime.utcnow()
        db.commit()
    finally:
        db.close()

async def execute_import_task(job_id: UUID):
    """Background task to process an import/restore."""
    db = SessionLocal()
    job = db.query(MigrationJob).filter(MigrationJob.id == job_id).first()
    if not job:
        db.close()
        return

    try:
        job.status = "running"
        job.current_stage = "downloading"
        job.started_at = datetime.utcnow()
        db.commit()

        # In a real implementation, we would download the file_url using StorageProvider
        # and parse it, validating schema, merging into database.
        # This is a stub for now.
        
        await asyncio.sleep(2) # Simulate work

        job.status = "completed"
        job.current_stage = "finished"
        job.progress_percentage = 100.0
        job.completed_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        job.status = "failed"
        job.error_log = str(e)
        job.completed_at = datetime.utcnow()
        db.commit()
    finally:
        db.close()
