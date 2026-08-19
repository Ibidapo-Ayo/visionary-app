import { create } from 'zustand';
import type { AuthStore } from '@/types/index';
import { getSupabaseUserIdByClerkId } from '@/services/supabase';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  supabaseUserId: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: !!user,
      supabaseUserId: user && state.user?.id === user.id ? state.supabaseUserId : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setSupabaseUserId: (supabaseUserId) => set({ supabaseUserId }),
  resolveSupabaseUserId: async (clerkUserId) => {
    const { user, supabaseUserId } = get();
    if (supabaseUserId) {
      return supabaseUserId;
    }

    const sourceClerkUserId = clerkUserId ?? user?.id;
    if (!sourceClerkUserId) {
      throw new Error('Unable to resolve Supabase user id: missing Clerk user id.');
    }

    const resolvedId = await getSupabaseUserIdByClerkId(sourceClerkUserId);

    // Only apply the result if the store still refers to the same Clerk user;
    // otherwise a user switch/reset during the lookup would leak a stale id.
    if (get().user?.id === sourceClerkUserId) {
      set({ supabaseUserId: resolvedId });
    }

    return resolvedId;
  },
  reset: () => set({ user: null, supabaseUserId: null, token: null, isAuthenticated: false, isLoading: false }),
}));
