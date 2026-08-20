import { useCallback } from 'react';
import { useSignIn } from '@clerk/expo';
import type { SignInInput, SignInResult } from '@/types/index';
import { toAuthError } from './errors';

export const useAuthSignIn = () => {
  const { signIn, fetchStatus } = useSignIn();
  const isLoaded = fetchStatus !== 'fetching' && Boolean(signIn);

  const doSignIn = useCallback(
    async (input: SignInInput): Promise<SignInResult> => {
      if (!isLoaded || !signIn) {
        return {
          complete: false,
          error: { code: 'not_loaded', message: 'Authentication is not ready yet.' },
        };
      }

      try {
        const signInResult = await signIn.password({
          identifier: input.identifier,
          password: input.password,
        });
        if (signInResult.error) {
          return { complete: false, error: toAuthError(signInResult.error) };
        }

        if (signIn.status === 'complete') {
          const finalizeResult = await signIn.finalize();
          if (finalizeResult.error) {
            return { complete: false, error: toAuthError(finalizeResult.error) };
          }

          return { complete: true };
        }

        if (signIn.status === 'needs_second_factor') {
          return { complete: false, needsSecondFactor: true };
        }

        return {
          complete: false,
          error: {
            code: signIn.status ?? 'sign_in_incomplete',
            message: 'Sign in could not be completed. Please try again.',
          },
        };
      } catch (err) {
        return { complete: false, error: toAuthError(err) };
      }
    },
    [isLoaded, signIn],
  );

  return { isLoaded, doSignIn };
};
