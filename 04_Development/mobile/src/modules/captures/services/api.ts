import { apiClient } from '../../../services/api';

export interface Capture {
  id: string;
  type: string;
  status: string;
  title?: string;
  content_text?: string;
  summary?: string;
  ocr_text?: string;
  transcript?: string;
  file_url?: string;
  thumbnail_path?: string;
  mime_type?: string;
  created_at: string;
  note_metadata?: any;
  media_metadata?: any;
  url_metadata?: any;
  location_metadata?: any;
  entities?: any[];
}

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
    formData.append('file', payload.file as any);
    
    const response = await apiClient.post('/captures/media', formData, {
      headers: {
        // Let Axios automatically set the Content-Type with the boundary
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data) => data, // Prevent Axios from stringifying FormData in RN
    });
    return response.data;
  },
  transcribeMedia: async (payload: { file: any }) => {
    const formData = new FormData();
    formData.append('file', payload.file as any);
    
    const response = await apiClient.post('/captures/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data) => data,
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
