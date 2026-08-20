import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useSSO } from '@clerk/expo';
import type { OAuthResult } from '@/types/index';
import { toAuthError } from './errors';

WebBrowser.maybeCompleteAuthSession();

/**
 * Google sign-in via Clerk's `useSSO` hook.
 *
 * Uses the browser-based flow supported in Expo Go and dev builds.
 * If a native "Sign in with Google" experience is required later, replace
 * this hook with Clerk's `useSignInWithGoogle` and configure the native
 * plugins in `app.json`.
 */
export const useGoogleAuth = () => {
  const { startSSOFlow } = useSSO();

  const signInWithGoogle = useCallback(async (): Promise<OAuthResult> => {
    try {
      const redirectUrl = Linking.createURL('/(app)/home', { scheme: 'visionary' });

      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      const { createdSessionId, setActive } = result;

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return { complete: true };
      }

      return {
        complete: false,
        error: {
          code: 'oauth_incomplete',
          message: 'Google sign-in did not complete. Please try again.',
        },
      };
    } catch (err) {
      return { complete: false, error: toAuthError(err) };
    }
  }, [startSSOFlow]);

  return { signInWithGoogle };
};
