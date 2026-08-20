import type { SupabaseEnv } from '@/types/index';

const requireEnv = (name: 'EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY'): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `[supabase] Missing ${name}. Add it to your .env file and restart the Expo bundler.`,
    );
  }

  return value;
};

export const getSupabaseEnv = (): SupabaseEnv => ({
  url: requireEnv('EXPO_PUBLIC_SUPABASE_URL'),
  anonKey: requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
});
