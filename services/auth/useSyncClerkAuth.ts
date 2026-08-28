import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/expo';
import { useAuthStore } from '@store/authStore';
import { useSyncUserToBackend } from './useCompleteAuthRegistration';


export const useSyncClerkAuth = () => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded } = useUser();

  const setLoading = useAuthStore((state) => state.setLoading);
  const reset = useAuthStore((state) => state.reset);
  const { syncUserToBackend } = useSyncUserToBackend();

  useEffect(() => {
    if (!authLoaded || !userLoaded) {
      setLoading(true);
      return;
    }

    if (!isSignedIn) {
      reset();
      return;
    }

    void syncUserToBackend().then((result) => {
      if (!result.complete && result.error && result.error.code !== 'auth_not_ready') {
        console.warn('[auth] Unable to sync user to backend:', result.error.message);
      }
    });
  }, [authLoaded, userLoaded, isSignedIn, reset, setLoading, syncUserToBackend]);
};
