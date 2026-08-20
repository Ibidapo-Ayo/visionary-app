import { useCallback } from 'react';
import { useClerk } from '@clerk/expo';
import { useAuthStore } from '@store/authStore';
import type { SignOutResult } from '@/types/index';
import { toAuthError } from './errors';

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
