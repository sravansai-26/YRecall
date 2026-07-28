import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, JSON, Float, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from ...core.database import Base

class MigrationJob(Base):
    __tablename__ = "migration_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # "import", "export", "restore"
    job_type = Column(String, nullable=False) 
    
    # "pending", "running", "completed", "failed", "cancelled"
    status = Column(String, default="pending", nullable=False)
    
    # Granular stage e.g. "compressing", "validating", "uploading"
    current_stage = Column(String, nullable=True)
    
    # E.g. 45.5
    progress_percentage = Column(Float, default=0.0)
    
    # "JSON", "ZIP", "CSV"
    archive_format = Column(String, nullable=True)
    
    # E.g. ["memories", "settings", "timeline"]
    categories = Column(JSONB, default=list)
    
    # Stats
    processed_items = Column(Integer, default=0)
    total_items = Column(Integer, default=0)
    
    # URL to the output file (if export) or uploaded file (if import)
    file_url = Column(String, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    checksum = Column(String, nullable=True)
    compression_type = Column(String, nullable=True) # e.g., "gzip", "none"
    
    # Configuration
    restore_mode = Column(String, nullable=True) # "full", "partial", "merge", "skip"
    
    # Logs and Diagnostics
    metadata_info = Column(JSONB, default=dict)
    warnings = Column(JSONB, default=list)
    error_log = Column(Text, nullable=True)
    validation_summary = Column(JSONB, default=dict)
    
    retry_count = Column(Integer, default=0)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="migration_jobs")
