import { create } from 'zustand';
import type { AuthStore } from '@/types/index';
import { getSupabaseUserIdByClerkId } from '@/services/supabase';

const cachedSupabaseUserIdsByClerkId: Record<string, string> = {};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  supabaseUserId: null,
  supabaseUserIdClerkUserId: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set((state) => {
      if (state.user?.id && state.supabaseUserId && state.supabaseUserIdClerkUserId === state.user.id) {
        cachedSupabaseUserIdsByClerkId[state.user.id] = state.supabaseUserId;
      }

      if (!user) {
        return {
          user: null,
          isAuthenticated: false,
          supabaseUserId: null,
          supabaseUserIdClerkUserId: null,
        };
      }

      const reassociatedSupabaseUserId =
        cachedSupabaseUserIdsByClerkId[user.id] ??
        (state.supabaseUserIdClerkUserId === user.id ? state.supabaseUserId : null);

      return {
        user,
        isAuthenticated: true,
        supabaseUserId: reassociatedSupabaseUserId ?? null,
        supabaseUserIdClerkUserId: reassociatedSupabaseUserId ? user.id : null,
      };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setSupabaseUserId: (supabaseUserId) =>
    set((state) => {
      const ownerClerkUserId = supabaseUserId ? state.user?.id ?? null : null;
      if (supabaseUserId && ownerClerkUserId) {
        cachedSupabaseUserIdsByClerkId[ownerClerkUserId] = supabaseUserId;
      }

      return {
        supabaseUserId,
        supabaseUserIdClerkUserId: ownerClerkUserId,
      };
    }),
  resolveSupabaseUserId: async (clerkUserId) => {
    const { user, supabaseUserId, supabaseUserIdClerkUserId } = get();
    const sourceClerkUserId = clerkUserId ?? user?.id;
    if (!sourceClerkUserId) {
      throw new Error('Unable to resolve Supabase user id: missing Clerk user id.');
    }

    if (supabaseUserId && supabaseUserIdClerkUserId === sourceClerkUserId) {
      return supabaseUserId;
    }

    const reassociatedSupabaseUserId = cachedSupabaseUserIdsByClerkId[sourceClerkUserId];
    if (reassociatedSupabaseUserId) {
      if (get().user?.id === sourceClerkUserId) {
        set({
          supabaseUserId: reassociatedSupabaseUserId,
          supabaseUserIdClerkUserId: sourceClerkUserId,
        });
      }

      return reassociatedSupabaseUserId;
    }

    const resolvedId = await getSupabaseUserIdByClerkId(sourceClerkUserId);
    cachedSupabaseUserIdsByClerkId[sourceClerkUserId] = resolvedId;

    // Only apply the result if the store still refers to the same Clerk user;
    // otherwise a user switch/reset during the lookup would leak a stale id.
    if (get().user?.id === sourceClerkUserId) {
      set({
        supabaseUserId: resolvedId,
        supabaseUserIdClerkUserId: sourceClerkUserId,
      });
    }

    return resolvedId;
  },
  reset: () =>
    set({
      user: null,
      supabaseUserId: null,
      supabaseUserIdClerkUserId: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
