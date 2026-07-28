from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime
from uuid import UUID

class MigrationJobResponse(BaseModel):
    id: UUID
    job_type: str
    status: str
    current_stage: Optional[str] = None
    progress_percentage: float
    archive_format: Optional[str] = None
    categories: List[str]
    processed_items: int
    total_items: int
    file_url: Optional[str] = None
    file_size_bytes: Optional[int] = None
    checksum: Optional[str] = None
    compression_type: Optional[str] = None
    restore_mode: Optional[str] = None
    metadata_info: Dict[str, Any]
    warnings: List[str]
    error_log: Optional[str] = None
    validation_summary: Dict[str, Any]
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class ExportRequest(BaseModel):
    categories: List[str] = Field(..., description="e.g. ['memories', 'timeline', 'settings']")
    archive_format: str = Field(default="ZIP", description="ZIP, JSON, CSV")
    compression_type: str = Field(default="gzip")

class ImportPreviewRequest(BaseModel):
    file_url: str = Field(..., description="URL or local path to uploaded file")

class ImportPreviewResponse(BaseModel):
    is_valid: bool
    version: str
    categories_found: List[str]
    item_counts: Dict[str, int]
    estimated_duration_seconds: int
    warnings: List[str]
    conflicts_detected: int

class ImportConfirmRequest(BaseModel):
    file_url: str
    restore_mode: str = Field(default="merge", description="merge, skip, replace, full")
