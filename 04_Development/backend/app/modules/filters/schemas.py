from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List, Any
from datetime import datetime

class MemoryFilterSettingsBase(BaseModel):
    default_timeline_sort: Optional[str] = None
    enabled_categories: Optional[List[str]] = None
    
    show_important_first: Optional[bool] = None
    show_frequently_accessed: Optional[bool] = None
    show_recently_discussed: Optional[bool] = None
    show_ai_recommended: Optional[bool] = None
    hide_low_value: Optional[bool] = None
    highlight_active_projects: Optional[bool] = None
    boost_learning_materials: Optional[bool] = None
    boost_work_content: Optional[bool] = None
    boost_personal_content: Optional[bool] = None

    auto_categorization: Optional[bool] = None
    duplicate_detection: Optional[bool] = None
    importance_scoring: Optional[bool] = None
    context_grouping: Optional[bool] = None
    relationship_clustering: Optional[bool] = None
    topic_grouping: Optional[bool] = None
    semantic_grouping: Optional[bool] = None
    timeline_consolidation: Optional[bool] = None

    hide_archived: Optional[bool] = None
    hide_completed_tasks: Optional[bool] = None
    hide_sensitive: Optional[bool] = None
    hide_temporary: Optional[bool] = None
    hide_deleted: Optional[bool] = None
    hide_workspace_memories: Optional[bool] = None

    semantic_search_priority: Optional[bool] = None
    keyword_search_priority: Optional[bool] = None
    hybrid_search: Optional[bool] = None
    relationship_depth: Optional[int] = None
    similarity_threshold: Optional[float] = None
    search_history_enabled: Optional[bool] = None
    search_suggestions: Optional[bool] = None

    ai_context_recent: Optional[bool] = None
    ai_context_pinned: Optional[bool] = None
    ai_context_project: Optional[bool] = None
    ai_context_important: Optional[bool] = None
    ai_context_favourite: Optional[bool] = None
    ai_context_voice: Optional[bool] = None
    ai_context_meeting: Optional[bool] = None

    auto_archive: Optional[bool] = None
    archive_inactivity_days: Optional[int] = None
    never_archive: Optional[bool] = None
    auto_favourite: Optional[bool] = None
    auto_pin: Optional[bool] = None
    keep_recent: Optional[bool] = None

    include_shared: Optional[bool] = None
    exclude_shared: Optional[bool] = None
    workspace_priority: Optional[bool] = None
    personal_priority: Optional[bool] = None
    merged_timeline: Optional[bool] = None
    
    active_preset: Optional[str] = None
    saved_presets: Optional[List[Any]] = None

class MemoryFilterSettingsUpdate(MemoryFilterSettingsBase):
    pass

class MemoryFilterSettingsResponse(MemoryFilterSettingsBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MemoryFilterStatsResponse(BaseModel):
    total_memories: int
    visible_memories: int
    hidden_memories: int
    archived_memories: int
    pinned_memories: int
    favourite_memories: int
    recently_added: int
    recently_accessed: int
    recently_modified: int
