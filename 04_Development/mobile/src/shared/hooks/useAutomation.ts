import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  priority: string;
  due_date?: string;
  status: string;
  created_by_automation: boolean;
  confidence_score?: number;
  ai_reasoning?: string;
}

export interface Suggestion {
  id: string;
  suggestion_type: string;
  proposed_configuration: any;
  reasoning?: string;
}

export function useReminders(status: string = "pending") {
  return useQuery({
    queryKey: ['reminders', status],
    queryFn: async () => {
      const { data } = await apiClient.get<Reminder[]>(`/automation/reminders?status=${status}`);
      return data;
    }
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Reminder> }) => {
      const { data } = await apiClient.put(`/automation/reminders/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    }
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/automation/reminders/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    }
  });
}

export function useSuggestions() {
  return useQuery({
    queryKey: ['automation-suggestions'],
    queryFn: async () => {
      const { data } = await apiClient.get<Suggestion[]>('/automation/suggestions');
      return data;
    }
  });
}

export function useAcceptSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/automation/suggestions/${id}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    }
  });
}

export function useDismissSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/automation/suggestions/${id}/dismiss`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-suggestions'] });
    }
  });
}
