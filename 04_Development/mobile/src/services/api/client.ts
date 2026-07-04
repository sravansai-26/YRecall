import { create } from 'axios';

import { API_TIMEOUT_MS } from '@/config/app';
import { env } from '@/config/env';

export const apiClient = create({
  baseURL: env.apiUrl,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
