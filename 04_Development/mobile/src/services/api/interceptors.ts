import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { STORAGE_KEYS } from '@/config/app';
import { getSecureItem } from '@/lib/secure-store';

import { apiClient } from './client';

type RequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
};

export function setupApiInterceptors(): void {
  apiClient.interceptors.request.use(async (config: RequestConfig) => {
    if (config.skipAuth) {
      return config;
    }

    const token = await getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);

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
