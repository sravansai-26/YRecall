import { apiClient } from '../../services/api/client';

export interface StorageBreakdownItem {
    category: string;
    size_bytes: number;
    item_count: number;
}

export interface StorageHealth {
    score: number;
    database_status: string;
    cloud_storage_status: string;
    cache_health: string;
    index_status: string;
    sync_status: string;
    pending_uploads: number;
    pending_downloads: number;
    warnings: string[];
}

export interface StorageStatsResponse {
    success: boolean;
    total_used_bytes: number;
    cloud_storage_bytes: number;
    local_storage_bytes: number;
    breakdown: StorageBreakdownItem[];
    health: StorageHealth;
}

export interface SyncEntity {
    id: string;
    entity_type: string;
    action: string;
    data: any;
    updated_at: string;
}

export interface SyncRequest {
    last_sync_timestamp: string | null;
    client_changes: SyncEntity[];
    client_device_id: string;
}

export interface SyncResponse {
    success: boolean;
    server_timestamp: string;
    server_changes: SyncEntity[];
    conflicts: any[];
    items_uploaded: number;
    items_downloaded: number;
    status: string;
}

export const fetchStorageStats = async (): Promise<StorageStatsResponse> => {
    const { data } = await apiClient.get('/storage/stats');
    return data;
};

export const performSyncAPI = async (request: SyncRequest): Promise<SyncResponse> => {
    const { data } = await apiClient.post('/storage/sync', request);
    return data;
};
