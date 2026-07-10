import { apiClient } from '../../services/api';

export const graphApi = {
  getNetwork: async () => {
    return await apiClient.get('/graph/network');
  },
  getEntityDetail: async (id: string) => {
    return await apiClient.get(`/graph/entity/${id}`);
  }
};
