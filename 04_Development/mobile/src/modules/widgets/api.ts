import { apiClient } from '../../../src/services/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface WidgetInstance {
    id: string;
    user_id: string;
    widget_id: string;
    instance_id: string;
    config: Record<string, any>;
    is_active: boolean;
    last_refresh: string | null;
    created_at: string;
}

export interface WidgetPreference {
    id: string;
    user_id: string;
    global_config: Record<string, any>;
    updated_at: string;
}

export const useWidgetInstances = () => {
    return useQuery<WidgetInstance[]>({
        queryKey: ['widget_instances'],
        queryFn: async () => {
            const res = await apiClient.get('/widgets/instances');
            return res.data;
        }
    });
};

export const useWidgetPreferences = () => {
    return useQuery<WidgetPreference>({
        queryKey: ['widget_preferences'],
        queryFn: async () => {
            const res = await apiClient.get('/widgets/preferences');
            return res.data;
        }
    });
};

export const useUpdateWidgetPreferences = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (global_config: Record<string, any>) => {
            const res = await apiClient.put('/widgets/preferences', { global_config });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['widget_preferences'] });
        }
    });
};
