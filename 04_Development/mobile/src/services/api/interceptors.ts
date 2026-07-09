import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { auth } from '@/shared/lib/firebase';
import { apiClient } from './client';

type RequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
};

export function setupApiInterceptors(): void {
  apiClient.interceptors.request.use(async (config: RequestConfig) => {
    if (config.skipAuth) {
      return config;
    }

    const token = await auth.currentUser?.getIdToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error),
  );
}
