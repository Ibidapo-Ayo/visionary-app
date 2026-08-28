import { useCallback, useRef } from 'react';
import { useAuth, useUser } from '@clerk/expo';
import { useAuthStore } from '@store/authStore';
import type { AuthErrorShape, ClerkAuthUserResource, User } from '@/types/index';
import { syncProfileFromClerkUser } from '@services/supabase';
import { mapClerkUser, toAuthError } from './errors';

type SyncUserToBackendResult = {
  complete: boolean;
  error?: AuthErrorShape;
};

const toProjectedUser = (user: ClerkAuthUserResource): User | null => {
  const mapped = mapClerkUser(user);
  if (!mapped) {
    return null;
  }

  return {
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
};

export const useSyncUserToBackend = () => {
  const { isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded, user: clerkUser } = useUser();

  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setSupabaseUserId = useAuthStore((state) => state.setSupabaseUserId);
  const resolveSupabaseUserId = useAuthStore((state) => state.resolveSupabaseUserId);
  const clerkUserRef = useRef(clerkUser);

  clerkUserRef.current = clerkUser;

  const syncUserToBackend = useCallback(async (): Promise<SyncUserToBackendResult> => {
    setLoading(true);

    try {
      const readyUser = clerkUserRef.current as ClerkAuthUserResource | null;

      if (!authLoaded || !userLoaded || !readyUser) {
        return {
          complete: false,
          error: {
            code: 'auth_not_ready',
            message: 'Authentication is still finishing. Please try again.',
          },
        };
      }

      const projectedUser = toProjectedUser(readyUser);
      if (!projectedUser) {
        return {
          complete: false,
          error: {
            code: 'invalid_user',
            message: 'Unable to prepare your account profile. Please try again.',
          },
        };
      }

      const row = await syncProfileFromClerkUser(readyUser);
      setUser({
        ...projectedUser,
        profileImage: row.profile_image ?? projectedUser.profileImage,
        bio: row.bio ?? projectedUser.bio,
        gender: row.gender ?? projectedUser.gender,
        updatedAt: row.updated_at,
      });

      if (row.id) {
        setSupabaseUserId(row.id);
      } else {
        const resolvedId = await resolveSupabaseUserId(projectedUser.id);
        setSupabaseUserId(resolvedId);
      }

      return { complete: true };
    } catch (error) {
      return {
        complete: false,
        error: toAuthError(error),
      };
    } finally {
      setLoading(false);
    }
  }, [authLoaded, resolveSupabaseUserId, setLoading, setSupabaseUserId, setUser, userLoaded]);

  return {
    syncUserToBackend,
  };
};

export const useCompleteAuthRegistration = useSyncUserToBackend;