import { useCallback } from 'react';
import { useSignUp } from '@clerk/expo';
import type { AuthErrorShape, SignUpInput, SignUpResult } from '@/types/index';
import { toAuthError } from './errors';

/**
 * `useAuthSignUp` wraps Clerk's `useSignUp` hook and exposes ministry-shaped
 * primitives that our screens consume without ever importing Clerk directly.
 */
export const useAuthSignUp = () => {
  const { signUp, fetchStatus } = useSignUp();
  const isLoaded = fetchStatus !== 'fetching' && Boolean(signUp);

  const startSignUp = useCallback(
    async (input: SignUpInput): Promise<SignUpResult> => {
      if (!isLoaded || !signUp) {
        return {
          needsEmailVerification: false,
          complete: false,
          error: { code: 'not_loaded', message: 'Authentication is not ready yet.' },
        };
      }

      try {
        const normalizedPhone = input.phone?.trim();
        const createResult = await signUp.create({
          firstName: input.firstName,
          lastName: input.lastName,
          emailAddress: input.emailAddress,
          unsafeMetadata: {
            phone_number: normalizedPhone || null,
          },
          password: input.password,
        });
        if (createResult.error) {
          return { needsEmailVerification: false, complete: false, error: toAuthError(createResult.error) };
        }

        const sendCodeResult = await signUp.verifications.sendEmailCode();
        if (sendCodeResult.error) {
          return { needsEmailVerification: false, complete: false, error: toAuthError(sendCodeResult.error) };
        }

        return { needsEmailVerification: true, complete: false };
      } catch (err) {
        return { needsEmailVerification: false, complete: false, error: toAuthError(err) };
      }
    },
    [isLoaded, signUp],
  );

  const verifyEmailCode = useCallback(
    async (code: string): Promise<SignUpResult> => {
      if (!isLoaded || !signUp) {
        return {
          needsEmailVerification: true,
          complete: false,
          error: { code: 'not_loaded', message: 'Authentication is not ready yet.' },
        };
      }

      try {
        const verifyResult = await signUp.verifications.verifyEmailCode({ code });
        if (verifyResult.error) {
          return {
            needsEmailVerification: true,
            complete: false,
            error: toAuthError(verifyResult.error),
          };
        }

        if (signUp.status === 'complete') {
          const finalizeResult = await signUp.finalize();
          if (finalizeResult.error) {
            return {
              needsEmailVerification: true,
              complete: false,
              error: toAuthError(finalizeResult.error),
            };
          }

          return { needsEmailVerification: false, complete: true };
        }

        return {
          needsEmailVerification: true,
          complete: false,
          error: { code: 'verification_incomplete', message: 'Verification is not complete yet.' },
        };
      } catch (err) {
        return {
          needsEmailVerification: true,
          complete: false,
          error: toAuthError(err),
        };
      }
    },
    [isLoaded, signUp],
  );

  const resendEmailCode = useCallback(async (): Promise<AuthErrorShape | null> => {
    if (!isLoaded || !signUp) {
      return { code: 'not_loaded', message: 'Authentication is not ready yet.' };
    }
    try {
      const sendCodeResult = await signUp.verifications.sendEmailCode();
      if (sendCodeResult.error) {
        return toAuthError(sendCodeResult.error);
      }

      return null;
    } catch (err) {
      return toAuthError(err);
    }
  }, [isLoaded, signUp]);

  return { isLoaded, startSignUp, verifyEmailCode, resendEmailCode };
};
