import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useStreakStore } from '@/store/streakStore';

/**
 * Loads the current user's backend-computed streak — Supabase's `streaks` table is the
 * only source of truth, this hook never derives current/longest streak values itself.
 */
export const useStreak = () => {
  const user = useAuthStore((state) => state.user);
  const supabaseUserId = useAuthStore((state) => state.supabaseUserId);
  const resolveSupabaseUserId = useAuthStore((state) => state.resolveSupabaseUserId);

  const streak = useStreakStore((state) => state.streak);
  const isLoadingStreak = useStreakStore((state) => state.isLoadingStreak);
  const streakError = useStreakStore((state) => state.streakError);
  const loadStreak = useStreakStore((state) => state.loadStreak);
  const completeReadingDayAction = useStreakStore((state) => state.completeReadingDay);

  const resolveUserId = useCallback(async () => {
    if (!user?.id) {
      return null;
    }

    return supabaseUserId ?? resolveSupabaseUserId(user.id);
  }, [user?.id, supabaseUserId, resolveSupabaseUserId]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void resolveUserId()
      .then((resolvedUserId) => {
        if (resolvedUserId) {
          return loadStreak(resolvedUserId);
        }
      })
      .catch((error) => {
        console.warn('Unable to load streak:', error);
      });
  }, [user?.id, resolveUserId, loadStreak]);

  const refreshStreak = useCallback(async () => {
    const resolvedUserId = await resolveUserId();
    if (!resolvedUserId) {
      return;
    }

    await loadStreak(resolvedUserId, { force: true });
  }, [resolveUserId, loadStreak]);

  const completeReadingDay = useCallback(async () => {
    const resolvedUserId = await resolveUserId();
    if (!resolvedUserId) {
      return;
    }

    await completeReadingDayAction(resolvedUserId);
  }, [resolveUserId, completeReadingDayAction]);

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
