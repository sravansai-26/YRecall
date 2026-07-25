from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float, ARRAY, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
from ...core.database import Base

class MemoryFilterSettings(Base):
    __tablename__ = "memory_filter_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # 2. Default Timeline Filters
    default_timeline_sort = Column(String, default="recent_first") # show_all, recent_first, pinned_first, unread_first, important_first, ai_prioritized, project_first, people_first, media_first

    # 3. Memory Categories (enabled categories)
    enabled_categories = Column(JSONB, default=["notes", "voice", "images", "videos", "pdfs", "links", "locations", "meetings", "tasks", "projects", "people", "events"])
    
    # 4. AI Prioritization
    show_important_first = Column(Boolean, default=False)
    show_frequently_accessed = Column(Boolean, default=False)
    show_recently_discussed = Column(Boolean, default=False)
    show_ai_recommended = Column(Boolean, default=True)
    hide_low_value = Column(Boolean, default=False)
    highlight_active_projects = Column(Boolean, default=True)
    boost_learning_materials = Column(Boolean, default=False)
    boost_work_content = Column(Boolean, default=False)
    boost_personal_content = Column(Boolean, default=False)

    # 5. Smart Filtering
    auto_categorization = Column(Boolean, default=True)
    duplicate_detection = Column(Boolean, default=True)
    importance_scoring = Column(Boolean, default=True)
    context_grouping = Column(Boolean, default=True)
    relationship_clustering = Column(Boolean, default=True)
    topic_grouping = Column(Boolean, default=True)
    semantic_grouping = Column(Boolean, default=True)
    timeline_consolidation = Column(Boolean, default=False)

    # 6. Visibility Rules
    hide_archived = Column(Boolean, default=True)
    hide_completed_tasks = Column(Boolean, default=False)
    hide_sensitive = Column(Boolean, default=False)
    hide_temporary = Column(Boolean, default=True)
    hide_deleted = Column(Boolean, default=True)
    hide_workspace_memories = Column(Boolean, default=False)

    # 7. Search Behaviour
    semantic_search_priority = Column(Boolean, default=True)
    keyword_search_priority = Column(Boolean, default=False)
    hybrid_search = Column(Boolean, default=True)
    relationship_depth = Column(Integer, default=1) # 1-3
    similarity_threshold = Column(Float, default=0.75)
    search_history_enabled = Column(Boolean, default=True)
    search_suggestions = Column(Boolean, default=True)

    # 8. AI Context Selection
    ai_context_recent = Column(Boolean, default=True)
    ai_context_pinned = Column(Boolean, default=True)
    ai_context_project = Column(Boolean, default=True)
    ai_context_important = Column(Boolean, default=True)
    ai_context_favourite = Column(Boolean, default=True)
    ai_context_voice = Column(Boolean, default=True)
    ai_context_meeting = Column(Boolean, default=True)

    # 9. Retention Preferences
    auto_archive = Column(Boolean, default=False)
    archive_inactivity_days = Column(Integer, default=90)
    never_archive = Column(Boolean, default=False)
    auto_favourite = Column(Boolean, default=False)
    auto_pin = Column(Boolean, default=False)
    keep_recent = Column(Boolean, default=True)

    # 10. Workspace Filters
    include_shared = Column(Boolean, default=True)
    exclude_shared = Column(Boolean, default=False)
    workspace_priority = Column(Boolean, default=False)
    personal_priority = Column(Boolean, default=True)
    merged_timeline = Column(Boolean, default=True)
    
    # 11 & 12. Presets
    active_preset = Column(String, default="default")
    saved_presets = Column(JSONB, default=[])

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
