import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

export interface SecuritySettings {
  biometric_enabled: boolean;
  app_lock_timeout: number;
  require_for_opening: boolean;
  require_for_settings: boolean;
  require_for_exports: boolean;
  require_for_deleting: boolean;
  require_for_sensitive: boolean;
  protected_categories: string[];
  hide_app_preview: boolean;
  hide_memory_content: boolean;
}

export interface DeviceSession {
  id: string;
  device_id: string;
  device_name: string | null;
  platform: string | null;
  location: string | null;
  is_trusted: boolean;
  started_at: string;
  last_active_at: string;
  revoked_at: string | null;
}

export interface SecurityAuditLog {
  id: string;
  event_type: string;
  device_id: string | null;
  ip_address: string | null;
  details: Record<string, any> | null;
  created_at: string;
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get<SecuritySettings>('/security/settings');
      return data;
    }
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<SecuritySettings>) => {
      const { data } = await apiClient.put<SecuritySettings>('/security/settings', updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-settings'] });
      queryClient.invalidateQueries({ queryKey: ['security-logs'] });
    }
  });
}

export function useDeviceSessions() {
  return useQuery({
    queryKey: ['security-sessions'],
    queryFn: async () => {
      const { data } = await apiClient.get<DeviceSession[]>('/security/sessions');
      return data;
    }
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/security/sessions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['security-logs'] });
    }
  });
}

export function useSecurityLogs() {
  return useQuery({
    queryKey: ['security-logs'],
    queryFn: async () => {
      const { data } = await apiClient.get<SecurityAuditLog[]>('/security/logs');
      return data;
    }
  });
}
