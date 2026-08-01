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

export interface CreateTextPayload {
 content_text: string;
}

export interface CreateMediaPayload {
 type: string;
 file: any; // React Native File/Blob object
 upload_id?: string;
 title?: string;
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
 createText: async (payload: CreateTextPayload) => {
 const response = await apiClient.post('/captures/text', payload);
 return response.data;
 },
 createNote: async (payload: CreateNotePayload) => {
 const response = await apiClient.post('/captures/note', payload);
 return response.data;
 },
 createMedia: async (payload: CreateMediaPayload) => {
 const formData = new FormData();
 formData.append('type', payload.type);
 formData.append('file', payload.file as any);
 if (payload.upload_id) {
     formData.append('upload_id', payload.upload_id);
 }
 if (payload.title) {
     formData.append('title', payload.title);
 }
 
 const response = await apiClient.post('/captures/media', formData, {
  headers: {
      'Content-Type': 'multipart/form-data',
  },
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
 },
 deleteCapture: async (id: string) => {
 const response = await apiClient.delete(`/captures/${id}`);
 return response.data;
 },
 searchCaptures: async (q: string, skip: number = 0, limit: number = 20) => {
 const response = await apiClient.get('/captures/search', {
     params: { q, skip, limit }
 });
 return response.data;
 }
};
