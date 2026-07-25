import { apiClient } from '../../../src/services/api/client';

export interface MemoryFilterSettings {
    id?: string;
    default_timeline_sort?: string;
    enabled_categories?: string[];
    
    show_important_first?: boolean;
    show_frequently_accessed?: boolean;
    show_recently_discussed?: boolean;
    show_ai_recommended?: boolean;
    hide_low_value?: boolean;
    highlight_active_projects?: boolean;
    boost_learning_materials?: boolean;
    boost_work_content?: boolean;
    boost_personal_content?: boolean;

    auto_categorization?: boolean;
    duplicate_detection?: boolean;
    importance_scoring?: boolean;
    context_grouping?: boolean;
    relationship_clustering?: boolean;
    topic_grouping?: boolean;
    semantic_grouping?: boolean;
    timeline_consolidation?: boolean;

    hide_archived?: boolean;
    hide_completed_tasks?: boolean;
    hide_sensitive?: boolean;
    hide_temporary?: boolean;
    hide_deleted?: boolean;
    hide_workspace_memories?: boolean;

    semantic_search_priority?: boolean;
    keyword_search_priority?: boolean;
    hybrid_search?: boolean;
    relationship_depth?: number;
    similarity_threshold?: number;
    search_history_enabled?: boolean;
    search_suggestions?: boolean;

    ai_context_recent?: boolean;
    ai_context_pinned?: boolean;
    ai_context_project?: boolean;
    ai_context_important?: boolean;
    ai_context_favourite?: boolean;
    ai_context_voice?: boolean;
    ai_context_meeting?: boolean;

    auto_archive?: boolean;
    archive_inactivity_days?: number;
    never_archive?: boolean;
    auto_favourite?: boolean;
    auto_pin?: boolean;
    keep_recent?: boolean;

    include_shared?: boolean;
    exclude_shared?: boolean;
    workspace_priority?: boolean;
    personal_priority?: boolean;
    merged_timeline?: boolean;
    
    active_preset?: string;
    saved_presets?: any[];
}

export interface MemoryFilterStats {
    total_memories: number;
    visible_memories: number;
    hidden_memories: number;
    archived_memories: number;
    pinned_memories: number;
    favourite_memories: number;
    recently_added: number;
    recently_accessed: number;
    recently_modified: number;
}

export const filtersApi = {
    getSettings: () => apiClient.get<MemoryFilterSettings>('/filters/settings'),
    updateSettings: (data: Partial<MemoryFilterSettings>) => apiClient.put<MemoryFilterSettings>('/filters/settings', data),
    getStats: () => apiClient.get<MemoryFilterStats>('/filters/stats'),
};
