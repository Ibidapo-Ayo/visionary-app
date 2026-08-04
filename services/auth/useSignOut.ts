import { useCallback } from 'react';
import { useClerk } from '@clerk/expo';
import { useAuthStore } from '@store/authStore';
import { toAuthError, type AuthErrorShape } from './errors';

export interface SignOutResult {
  success: boolean;
  error?: AuthErrorShape;
}

export const useSignOut = () => {
  const { signOut } = useClerk();
  const reset = useAuthStore((state) => state.reset);

  return useCallback(async (): Promise<SignOutResult> => {
    try {
      await signOut();
      reset();
      return { success: true };
    } catch (err) {
      return { success: false, error: toAuthError(err) };
    }
  }, [signOut, reset]);
};
