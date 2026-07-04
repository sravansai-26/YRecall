export const APP_NAME = 'YRecall' as const;

export const APP_SCHEME = 'yrecall' as const;

export const API_TIMEOUT_MS = 30_000 as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  MMKV_ENCRYPTION_KEY: 'mmkv_encryption_key',
} as const;
