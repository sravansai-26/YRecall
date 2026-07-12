import { apiClient } from '../../services/api/client';

export const homeApi = {
  getDashboard: async (workspaceId?: string | null) => {
    const params = workspaceId ? `?workspace_id=${workspaceId}` : '';
    const response = await apiClient.get(`/home/dashboard${params}`);
    return response.data;
  },
  
  getAnalytics: async (days: number = 7) => {
    const response = await apiClient.get(`/home/analytics?days=${days}`);
    return response.data;
  },

  refreshDailyBrief: async () => {
    const response = await apiClient.post('/home/daily/refresh');
    return response.data;
  },

  generateReflection: async (timeframe: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    const response = await apiClient.post('/ai/reflect', { timeframe });
    return response.data;
  }
};
