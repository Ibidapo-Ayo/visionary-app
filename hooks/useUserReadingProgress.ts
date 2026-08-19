import { useCallback, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserReadingProgressStore } from '@/store/userReadingProgressStore';

/**
 * Resolves the current user's Supabase id from Clerk, loads their persisted reading
 * progress, and exposes helpers for checking/marking chapter completion. Centralizes
 * the Clerk -> Supabase id resolution so screens never have to deal with it directly.
 */
export const useUserReadingProgress = () => {
  const user = useAuthStore((state) => state.user);
  const supabaseUserId = useAuthStore((state) => state.supabaseUserId);
  const supabaseUserIdClerkUserId = useAuthStore((state) => state.supabaseUserIdClerkUserId);
  const resolveSupabaseUserId = useAuthStore((state) => state.resolveSupabaseUserId);

  const loadUserReadingProgress = useUserReadingProgressStore((state) => state.loadUserReadingProgress);
  const markScheduleCompleteAction = useUserReadingProgressStore((state) => state.markScheduleComplete);
  const completedScheduleIdsByUser = useUserReadingProgressStore((state) => state.completedScheduleIdsByUser);
  const loadedUserId = useUserReadingProgressStore((state) => state.loadedUserId);
  const isLoadingProgress = useUserReadingProgressStore((state) => state.isLoadingProgress);

  const resolveUserId = useCallback(async () => {
    if (!user?.id) {
      return null;
    }

    if (supabaseUserId && supabaseUserIdClerkUserId === user.id) {
      return supabaseUserId;
    }

    return resolveSupabaseUserId(user.id);
  }, [user?.id, supabaseUserId, supabaseUserIdClerkUserId, resolveSupabaseUserId]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void resolveUserId()
      .then((resolvedUserId) => {
        if (resolvedUserId) {
          return loadUserReadingProgress(resolvedUserId);
        }
      })
      .catch((error) => {
        console.warn('Unable to load user reading progress:', error);
      });
  }, [user?.id, resolveUserId, loadUserReadingProgress]);

  const completedScheduleIds = useMemo(() => {
    const resolvedId =
      supabaseUserId && user?.id && supabaseUserIdClerkUserId === user.id
        ? supabaseUserId
        : loadedUserId;

    return new Set(resolvedId ? completedScheduleIdsByUser[resolvedId] ?? [] : []);
  }, [completedScheduleIdsByUser, supabaseUserId, supabaseUserIdClerkUserId, loadedUserId, user?.id]);

  const isChapterComplete = useCallback(
    (scheduleId: string) => completedScheduleIds.has(scheduleId),
    [completedScheduleIds],
  );

  const countCompleted = useCallback(
    (scheduleIds: string[]) => scheduleIds.filter((scheduleId) => completedScheduleIds.has(scheduleId)).length,
    [completedScheduleIds],
  );

  const markScheduleComplete = useCallback(
    async (scheduleId: string) => {
      const resolvedUserId = await resolveUserId();
      if (!resolvedUserId) {
        throw new Error('Unable to resolve the current user.');
      }

      await markScheduleCompleteAction({ supabaseUserId: resolvedUserId, scheduleId });
    },
    [resolveUserId, markScheduleCompleteAction],
  );

  const refreshProgress = useCallback(async () => {
    const resolvedUserId = await resolveUserId();
    if (!resolvedUserId) {
      return;
    }

    await loadUserReadingProgress(resolvedUserId, { force: true });
  }, [resolveUserId, loadUserReadingProgress]);

  return {
    completedScheduleIds,
    isLoadingProgress,
    isChapterComplete,
    countCompleted,
    markScheduleComplete,
    refreshProgress,
  };
};
