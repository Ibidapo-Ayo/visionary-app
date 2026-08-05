import { create } from 'zustand';
import type { AuthStore } from '@/types/index';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
}));
