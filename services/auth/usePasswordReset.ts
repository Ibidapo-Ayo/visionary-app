import { useCallback } from 'react';
import { useSignIn } from '@clerk/expo';
import type { CompleteResetResult, RequestResetResult } from '@/types/index';
import { toAuthError } from './errors';

/**
 * Password reset flow via email verification code.
 *   1. `requestReset(email)` sends a reset code.
 *   2. `resetPassword(code, newPassword)` verifies the code and updates
 *      the password, activating the resulting session on success.
 */
export const usePasswordReset = () => {
  const { signIn, fetchStatus } = useSignIn();
  const isLoaded = fetchStatus !== 'fetching' && Boolean(signIn);

  const requestReset = useCallback(
    async (identifier: string): Promise<RequestResetResult> => {
      if (!isLoaded || !signIn) {
        return { sent: false, error: { code: 'not_loaded', message: 'Authentication is not ready yet.' } };
      }
      try {
        const createResult = await signIn.create({ identifier });
        if (createResult.error) {
          return { sent: false, error: toAuthError(createResult.error) };
        }

        const sendCodeResult = await signIn.resetPasswordEmailCode.sendCode();
        if (sendCodeResult.error) {
          return { sent: false, error: toAuthError(sendCodeResult.error) };
        }

        return { sent: true };
      } catch (err) {
        return { sent: false, error: toAuthError(err) };
      }
    },
    [isLoaded, signIn],
  );

  const resetPassword = useCallback(
    async (code: string, newPassword: string): Promise<CompleteResetResult> => {
      if (!isLoaded || !signIn) {
        return {
          complete: false,
          error: { code: 'not_loaded', message: 'Authentication is not ready yet.' },
        };
      }
      try {
        const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({ code });
        if (verifyResult.error) {
          return { complete: false, error: toAuthError(verifyResult.error) };
        }

        const submitPasswordResult = await signIn.resetPasswordEmailCode.submitPassword({
          password: newPassword,
        });
        if (submitPasswordResult.error) {
          return { complete: false, error: toAuthError(submitPasswordResult.error) };
        }

        if (signIn.status === 'complete') {
          const finalizeResult = await signIn.finalize();
          if (finalizeResult.error) {
            return { complete: false, error: toAuthError(finalizeResult.error) };
          }

          return { complete: true };
        }

        return {
          complete: false,
          error: {
            code: signIn.status ?? 'reset_incomplete',
            message: 'Password reset could not be completed. Please try again.',
          },
        };
      } catch (err) {
        return { complete: false, error: toAuthError(err) };
      }
    },
    [isLoaded, signIn],
  );

  return { isLoaded, requestReset, resetPassword };
};
