import { apiClient } from '../../services/api';

export const graphApi = {
  getNetwork: async () => {
    return await apiClient.get('/graph/network');
  },
  getEntityDetail: async (id: string) => {
    return await apiClient.get(`/graph/entity/${id}`);
  },
  getSettings: async () => {
    return await apiClient.get('/graph/settings');
  },
  updateSettings: async (settings: any) => {
    return await apiClient.patch('/graph/settings', settings);
  },
  runMaintenance: async (action: string) => {
    return await apiClient.post(`/graph/maintenance/${action}`);
  }
};
