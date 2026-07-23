import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/expo';
import { useAuthStore } from '@store/authStore';
import type { User } from '@/types/index';
import { mapClerkUser } from './errors';

/**
 * Bridges Clerk's `useAuth`/`useUser` into our Zustand `authStore` so
 * existing UI (profile header, greetings, etc.) keeps working without
 * screens importing Clerk directly.
 *
 * Mount this once inside `(app)/_layout.tsx` and `(auth)/_layout.tsx`.
 */
export const useSyncClerkAuth = () => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user: clerkUser } = useUser();

  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const reset = useAuthStore((state) => state.reset);

  useEffect(() => {
    if (!authLoaded || !userLoaded) {
      setLoading(true);
      return;
    }

    if (!isSignedIn) {
      reset();
      return;
    }

    const mapped = mapClerkUser(clerkUser);
    if (!mapped) {
      reset();
      return;
    }

    // Preserve existing ministry data (role, churchId) until Supabase
    // syncing is added; default sensible values for now.
    const projected: User = {
      id: mapped.id,
      firstName: mapped.firstName,
      lastName: mapped.lastName,
      email: mapped.email,
      phone: mapped.phone,
      role: 'MEMBER',
      churchId: 'church_1',
      joinDate: mapped.joinDate,
      profileImage: mapped.profileImage,
      createdAt: mapped.createdAt,
      updatedAt: mapped.updatedAt,
    };

    setUser(projected);
    setLoading(false);
  }, [authLoaded, userLoaded, isSignedIn, clerkUser, setUser, setLoading, reset]);
};
