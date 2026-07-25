import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filtersApi, MemoryFilterSettings } from './api';
import { Alert } from 'react-native';

export function useFiltersSettings() {
    return useQuery({
        queryKey: ['filters', 'settings'],
        queryFn: async () => {
            const res = await filtersApi.getSettings();
            return res.data;
        }
    });
}

export function useFiltersStats() {
    return useQuery({
        queryKey: ['filters', 'stats'],
        queryFn: async () => {
            const res = await filtersApi.getStats();
            return res.data;
        }
    });
}

export function useUpdateFiltersSettings() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: Partial<MemoryFilterSettings>) => {
            const res = await filtersApi.updateSettings(data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['filters', 'settings'] });
        },
        onError: (err: any) => {
            Alert.alert('Error', err?.message || 'Failed to update memory filters');
        }
    });
}
