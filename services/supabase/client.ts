import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import type { ClerkGetToken } from '@/types/index';
import { getSupabaseEnv } from './env';

const SUPABASE_JWT_TEMPLATE = 'supabase';
const TOKEN_CACHE_TTL_MS = 55_000;

let clerkGetToken: ClerkGetToken | null = null;
let cachedToken: string | null = null;
let cachedTokenExpiryMs = 0;

const clearCachedToken = () => {
  cachedToken = null;
  cachedTokenExpiryMs = 0;
};

const resolveAccessToken = async (): Promise<string | null> => {
  if (!clerkGetToken) {
    clearCachedToken();
    return null;
  }

  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiryMs) {
    return cachedToken;
  }

  const token = await clerkGetToken({ template: SUPABASE_JWT_TEMPLATE });

  if (!token) {
    clearCachedToken();
    return null;
  }

  cachedToken = token;
  cachedTokenExpiryMs = now + TOKEN_CACHE_TTL_MS;

  return cachedToken;
};

export const setSupabaseClerkTokenGetter = (next: ClerkGetToken | null) => {
  clerkGetToken = next;
  clearCachedToken();
};

const { url, anonKey } = getSupabaseEnv();

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  accessToken: resolveAccessToken,
});
