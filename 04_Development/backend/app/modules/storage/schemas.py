from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class StorageBreakdownItem(BaseModel):
    category: str
    size_bytes: int
    item_count: int

class StorageHealth(BaseModel):
    score: int
    database_status: str
    cloud_storage_status: str
    cache_health: str
    index_status: str
    sync_status: str
    pending_uploads: int
    pending_downloads: int
    warnings: List[str]

class StorageStatsResponse(BaseModel):
    success: bool
    total_used_bytes: int
    cloud_storage_bytes: int
    local_storage_bytes: int
    breakdown: List[StorageBreakdownItem]
    health: StorageHealth

class SyncEntity(BaseModel):
    id: str
    entity_type: str # 'capture', 'aiconversation', 'user_preference', 'knowledge_node', 'automation'
    action: str # 'create', 'update', 'delete'
    data: Dict[str, Any]
    updated_at: str

class SyncRequest(BaseModel):
    last_sync_timestamp: Optional[str] = None
    client_changes: List[SyncEntity]
    client_device_id: str

class SyncResponse(BaseModel):
    success: bool
    server_timestamp: str
    server_changes: List[SyncEntity]
    conflicts: List[Dict[str, Any]] # Info about items that conflicted
    items_uploaded: int
    items_downloaded: int
    status: str
