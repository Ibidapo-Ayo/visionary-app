import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/expo';
import { useAuthStore } from '@store/authStore';
import { useSyncUserToBackend } from './useCompleteAuthRegistration';

const SYNC_RETRY_LIMIT = 2;
const SYNC_RETRY_DELAY_MS = 1200;

export const useSyncClerkAuth = () => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded } = useUser();

  const setLoading = useAuthStore((state) => state.setLoading);
  const reset = useAuthStore((state) => state.reset);
  const { syncUserToBackend } = useSyncUserToBackend();

  useEffect(() => {
    let isCancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    if (!authLoaded || !userLoaded) {
      setLoading(true);
      return () => {
        isCancelled = true;
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
      };
    }

    if (!isSignedIn) {
      reset();
      return () => {
        isCancelled = true;
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
      };
    }

    const attemptSync = async (attempt: number): Promise<void> => {
      const result = await syncUserToBackend();

      if (isCancelled || result.complete) {
        return;
      }

      const errorCode = result.error?.code;
      const shouldSuppressWarning = errorCode === 'auth_not_ready' || errorCode === 'stale_sync';

      if (shouldSuppressWarning) {
        return;
      }

      if (attempt < SYNC_RETRY_LIMIT) {
        retryTimeout = setTimeout(() => {
          void attemptSync(attempt + 1);
        }, SYNC_RETRY_DELAY_MS * (attempt + 1));
        return;
      }

      if (result.error) {
        console.warn('[auth] Unable to sync user to backend:', result.error.message);
      }
    };

    void attemptSync(0);

    return () => {
      isCancelled = true;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [authLoaded, userLoaded, isSignedIn, reset, setLoading, syncUserToBackend]);
};
