import { apiClient } from '../../../services/api';

export interface CreateNotePayload {
  title: string | null;
  content_text: string;
  rich_text: any;
  format: string;
}

export interface CreateMediaPayload {
  type: string;
  file: any; // React Native File/Blob object
}

export interface CreateUrlPayload {
  url: string;
}

export interface CreateLocationPayload {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export const capturesApi = {
  createNote: async (payload: CreateNotePayload) => {
    const response = await apiClient.post('/captures/note', payload);
    return response.data;
  },
  createMedia: async (payload: CreateMediaPayload) => {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('file', payload.file);
    
    const response = await apiClient.post('/captures/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  createUrl: async (payload: CreateUrlPayload) => {
    const response = await apiClient.post('/captures/url', payload);
    return response.data;
  },
  createLocation: async (payload: CreateLocationPayload) => {
    const response = await apiClient.post('/captures/location', payload);
    return response.data;
  }
};
