import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';

export interface EncryptionSettings {
  secure_local_storage: boolean;
  encrypted_cache: boolean;
  encrypted_temp_files: boolean;
  offline_encryption: boolean;
  local_db_protection: boolean;
  secure_file_storage: boolean;
  auto_cache_cleanup: boolean;

  encrypted_uploads: boolean;
  protected_cloud_storage: boolean;
  encrypted_metadata: boolean;
  protected_sync: boolean;
  secure_api: boolean;

  enhanced_protection_categories: string[];

  default_protection_level: string;
  sensitive_data_policy: string;
  export_protection: boolean;
  sharing_protection: boolean;
  temp_file_lifetime_hours: number;
  
  encrypted_sharing: boolean;
  workspace_encryption: boolean;
  protected_shared_links: boolean;
  share_expiration_days: number;
  access_restrictions: boolean;
  
  encrypted_backup: boolean;
  backup_verification: boolean;
  auto_backup_validation: boolean;
  backup_integrity_checks: boolean;
  restore_verification: boolean;
}

export function useEncryptionSettings() {
  return useQuery<EncryptionSettings>({
    queryKey: ['encryption_settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/security/encryption-settings');
      return data;
    },
  });
}

export function useUpdateEncryptionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<EncryptionSettings>) => {
      const { data } = await apiClient.put('/security/encryption-settings', settings);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['encryption_settings'], data);
    },
  });
}
