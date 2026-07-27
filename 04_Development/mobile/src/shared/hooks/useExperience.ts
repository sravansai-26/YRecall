import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { Appearance, useColorScheme } from 'react-native';

export interface ExperienceSettings {
  theme: 'light' | 'dark' | 'system';
  accent_color: string;
  font_size: 'small' | 'medium' | 'large' | 'x-large';
  display_density: 'compact' | 'comfortable' | 'spacious';
  language: string;
  reading_mode: boolean;
  reduce_motion: boolean;
  high_contrast: boolean;
  color_blind_friendly: boolean;
  screen_reader_optimization: boolean;
}

export function useExperienceSettings() {
  return useQuery<ExperienceSettings>({
    queryKey: ['experience_settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/experience');
      return data;
    },
  });
}

export function useUpdateExperienceSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<ExperienceSettings>) => {
      const { data } = await apiClient.put('/users/experience', settings);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['experience_settings'], data);
    },
  });
}

// A utility hook to get the effective theme (resolves 'system' to actual 'light' or 'dark')
export function useEffectiveTheme() {
  const { data: settings } = useExperienceSettings();
  const systemColorScheme = useColorScheme();
  
  if (!settings || settings.theme === 'system') {
    return systemColorScheme || 'light';
  }
  return settings.theme;
}
