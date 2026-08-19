import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useStreakStore } from '@/store/streakStore';

/**
 * Loads the current user's backend-computed streak — Supabase's `streaks` table is the
 * only source of truth, this hook never derives current/longest streak values itself.
 */
export const useStreak = () => {
  const user = useAuthStore((state) => state.user);
  const resolveSupabaseUserId = useAuthStore((state) => state.resolveSupabaseUserId);

  const streak = useStreakStore((state) => state.streak);
  const isLoadingStreak = useStreakStore((state) => state.isLoadingStreak);
  const streakError = useStreakStore((state) => state.streakError);
  const loadStreak = useStreakStore((state) => state.loadStreak);
  const completeReadingDayAction = useStreakStore((state) => state.completeReadingDay);

  const isCurrentUser = useCallback((clerkUserId: string) => useAuthStore.getState().user?.id === clerkUserId, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const initiatingClerkUserId = user.id;
    let cancelled = false;

    void resolveSupabaseUserId(initiatingClerkUserId)
      .then((resolvedUserId) => {
        if (cancelled || !isCurrentUser(initiatingClerkUserId) || !resolvedUserId) {
          return;
        }

        return loadStreak(resolvedUserId);
      })
      .catch((error) => {
        if (!cancelled && isCurrentUser(initiatingClerkUserId)) {
          console.warn('Unable to load streak:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, resolveSupabaseUserId, loadStreak, isCurrentUser]);

  const refreshStreak = useCallback(async () => {
    const initiatingClerkUserId = user?.id;
    if (!initiatingClerkUserId) {
      return;
    }

    const resolvedUserId = await resolveSupabaseUserId(initiatingClerkUserId);
    if (!resolvedUserId || !isCurrentUser(initiatingClerkUserId)) {
      return;
    }

    await loadStreak(resolvedUserId, { force: true });
  }, [user?.id, resolveSupabaseUserId, loadStreak, isCurrentUser]);

  const completeReadingDay = useCallback(async () => {
    const initiatingClerkUserId = user?.id;
    if (!initiatingClerkUserId) {
      return;
    }

    const resolvedUserId = await resolveSupabaseUserId(initiatingClerkUserId);
    if (!resolvedUserId || !isCurrentUser(initiatingClerkUserId)) {
      return;
    }

    await completeReadingDayAction(resolvedUserId);
  }, [user?.id, resolveSupabaseUserId, completeReadingDayAction, isCurrentUser]);

  return {
    currentStreak: streak?.current_streak ?? 0,
    longestStreak: streak?.longest_streak ?? 0,
    totalDaysCompleted: streak?.total_days_completed ?? 0,
    isLoadingStreak,
    streakError,
    completeReadingDay,
    refreshStreak,
  };
};
