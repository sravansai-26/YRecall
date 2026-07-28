import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStorageStats, performSyncAPI, SyncRequest } from './api';

export const useStorageStats = () => {
    return useQuery({
        queryKey: ['storage_stats'],
        queryFn: fetchStorageStats,
        refetchInterval: 60000, // Refresh every minute
    });
};
