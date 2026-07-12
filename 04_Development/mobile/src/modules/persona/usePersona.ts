import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personaApi, PersonaProfile, UserPersona } from './api';
import { Alert } from 'react-native';

export function usePersonaProfile() {
    return useQuery({
        queryKey: ['persona', 'profile'],
        queryFn: async () => {
            const res = await personaApi.getProfile();
            return res;
        }
    });
}

export function useUpdatePersona() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: Partial<UserPersona>) => {
            const res = await personaApi.updatePersona(data);
            return res.persona;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['persona', 'profile'] });
        },
        onError: (err: any) => {
            Alert.alert('Error', err?.message || 'Failed to update persona');
        }
    });
}

export function useResetLearning() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            await personaApi.resetLearning();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['persona', 'profile'] });
            Alert.alert('Success', 'AI learning behavior has been reset.');
        }
    });
}
