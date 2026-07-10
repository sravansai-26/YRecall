import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { homeApi } from './api';

const CACHE_KEY = '@yrecall_dashboard_cache';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        const result = await homeApi.getDashboard();
        // Save to offline cache
        if (result.success && result.data) {
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result.data)).catch(() => {});
        }
        return result.data;
      } catch (error) {
        // Fallback to offline cache if network fails
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
  });
}

export function useAnalytics(days: number = 7) {
  return useQuery({
    queryKey: ['analytics', days],
    queryFn: async () => {
      const result = await homeApi.getAnalytics(days);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

import { Alert } from 'react-native';

export function useGenerateReflection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (timeframe: 'daily' | 'weekly' | 'monthly') => homeApi.generateReflection(timeframe),
    onSuccess: () => {
      // Invalidate dashboard to fetch new brief and insights
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        Alert.alert(
          "Limit Reached", 
          "You've hit the limit today, please upgrade the plan for more briefings."
        );
      } else {
        Alert.alert("Error", "Failed to generate reflection. Please try again later.");
      }
    }
  });
}
