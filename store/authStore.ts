import { create } from 'zustand';
import { User, AuthState } from '@/types/index';

/**
 * The auth store is now a *thin projection* of Clerk's state so screens
 * that read user data (profile, header) don't have to bind to Clerk hooks
 * directly. Session persistence, sign in/up/out are owned by Clerk and
 * `services/auth`. The store is hydrated by `useSyncClerkAuth` on mount.
 */
interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
}));
