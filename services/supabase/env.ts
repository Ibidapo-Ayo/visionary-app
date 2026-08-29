import type { SupabaseEnv } from '@/types/index';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

const requireEnvValue = (
  value: string | undefined,
  name: 'EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY'
): string => {

  if (!value) {
    throw new Error(
      `[supabase] Missing ${name}. Add it to your .env file and restart the Expo bundler.`,
    );
  }

  return value;
};

export const getSupabaseEnv = (): SupabaseEnv => ({
  url: requireEnvValue(supabaseUrl, 'EXPO_PUBLIC_SUPABASE_URL'),
  anonKey: requireEnvValue(supabaseAnonKey, 'EXPO_PUBLIC_SUPABASE_ANON_KEY'),
});
