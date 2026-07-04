import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url().default('http://localhost:8000/api/v1'),
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

const parsed = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
});

export const env = {
  apiUrl: parsed.EXPO_PUBLIC_API_URL,
  appEnv: parsed.EXPO_PUBLIC_APP_ENV,
  isDev: parsed.EXPO_PUBLIC_APP_ENV === 'development',
  isProduction: parsed.EXPO_PUBLIC_APP_ENV === 'production',
} as const;

export type AppEnv = typeof env;
