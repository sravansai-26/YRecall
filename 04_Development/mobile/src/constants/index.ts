export const QUERY_KEYS = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  home: {
    feed: ['home', 'feed'] as const,
  },
  capture: {
    drafts: ['capture', 'drafts'] as const,
  },
} as const;

export const ROUTES = {
  root: '/',
  auth: '/(auth)',
  main: '/(main)',
  tabs: '/(main)/(tabs)',
} as const;

export const DEFAULT_PAGE_SIZE = 20 as const;

export const MAX_RETRY_ATTEMPTS = 3 as const;
