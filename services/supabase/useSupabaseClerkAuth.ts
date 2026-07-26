import { useEffect } from 'react';
import { useAuth } from '@clerk/expo';
import { setSupabaseClerkTokenGetter, supabase } from './client';

/**
 * Keeps Supabase authenticated with the current Clerk session by wiring
 * Clerk's `getToken` into the singleton Supabase client.
 */
export const useSupabaseClerkAuth = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setSupabaseClerkTokenGetter(null);
      return;
    }

    setSupabaseClerkTokenGetter(getToken);

    return () => {
      setSupabaseClerkTokenGetter(null);
    };
  }, [isLoaded, isSignedIn, getToken]);

  return { supabase, isSupabaseAuthReady: isLoaded && isSignedIn };
};
