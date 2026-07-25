import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voiceApi, VoiceSettings } from './api';
import { Alert } from 'react-native';

export function useVoiceSettings() {
    return useQuery({
        queryKey: ['voice', 'settings'],
        queryFn: async () => {
            const res = await voiceApi.getSettings();
            return res.data;
        }
    });
}

export function useVoiceStats() {
    return useQuery({
        queryKey: ['voice', 'stats'],
        queryFn: async () => {
            const res = await voiceApi.getStats();
            return res.data;
        }
    });
}

export function useUpdateVoiceSettings() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: Partial<VoiceSettings>) => {
            const res = await voiceApi.updateSettings(data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voice', 'settings'] });
        },
        onError: (err: any) => {
            Alert.alert('Error', err?.message || 'Failed to update voice settings');
        }
    });
}
