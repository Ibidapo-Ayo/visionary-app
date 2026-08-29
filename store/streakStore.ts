import { create } from "zustand";
import type { StreakRecord } from "@/types/index";
import { completeReadingDay as requestCompleteReadingDay, syncStreakStatus } from "@/services/supabase/streaks";

type StreakStore = {
  streak: StreakRecord | null;
  loadedUserId: string | null;
  loadingUserId: string | null;
  lastCompletedUserId: string | null;
  lastCompletionWasNewRecord: boolean;
  streakRequestVersion: number;
  isLoadingStreak: boolean;
  streakError: string | null;
  loadStreak: (userId: string, options?: { force?: boolean }) => Promise<void>;
  completeReadingDay: (userId: string) => Promise<void>;
};

export const useStreakStore = create<StreakStore>((set, get) => ({
  streak: null,
  loadedUserId: null,
  loadingUserId: null,
  lastCompletedUserId: null,
  lastCompletionWasNewRecord: false,
  streakRequestVersion: 0,
  isLoadingStreak: false,
  streakError: null,
  loadStreak: async (userId, options) => {
    const { isLoadingStreak, loadedUserId, loadingUserId, streakRequestVersion } = get();
    const force = options?.force ?? false;

    if (loadedUserId === userId && !force) {
      return;
    }

    if (isLoadingStreak && loadingUserId === userId && !force) {
      return;
    }

    const requestVersion = streakRequestVersion + 1;

    set((state) => ({
      ...(state.loadedUserId !== userId
        ? {
            streak: null,
            loadedUserId: null,
          }
        : {}),
      isLoadingStreak: true,
      loadingUserId: userId,
      streakRequestVersion: requestVersion,
      streakError: null,
    }));

    try {
      const streak = await syncStreakStatus(userId);
      const currentState = get();
      if (
        currentState.loadingUserId !== userId ||
        currentState.streakRequestVersion !== requestVersion
      ) {
        return;
      }

      set({
        streak,
        loadedUserId: userId,
        isLoadingStreak: false,
        loadingUserId: null,
      });
    } catch (error) {
      const currentState = get();
      if (
        currentState.loadingUserId !== userId ||
        currentState.streakRequestVersion !== requestVersion
      ) {
        return;
      }

      set({
        streakError: error instanceof Error ? error.message : "Unable to load streak.",
        isLoadingStreak: false,
        loadingUserId: null,
      });

      throw error;
    }
  },
  completeReadingDay: async (userId) => {
    const { isLoadingStreak, loadingUserId, streakRequestVersion } = get();

    if (isLoadingStreak && loadingUserId === userId) {
      return;
    }

    const currentState = get();
    const hasKnownPreviousRecord = currentState.loadedUserId === userId && !!currentState.streak;
    const previousLongestStreak = hasKnownPreviousRecord ? currentState.streak?.longest_streak ?? 0 : null;
    const requestVersion = streakRequestVersion + 1;

    set((state) => ({
      ...(state.loadedUserId !== userId
        ? {
            streak: null,
            loadedUserId: null,
          }
        : {}),
      isLoadingStreak: true,
      loadingUserId: userId,
      streakRequestVersion: requestVersion,
      streakError: null,
    }));

    try {
      const streak = await requestCompleteReadingDay(userId);
      const currentState = get();
      if (
        currentState.loadingUserId !== userId ||
        currentState.streakRequestVersion !== requestVersion
      ) {
        return;
      }

      const isNewRecord = previousLongestStreak !== null && streak.longest_streak > previousLongestStreak;

      set({
        streak,
        loadedUserId: userId,
        isLoadingStreak: false,
        loadingUserId: null,
        lastCompletedUserId: userId,
        lastCompletionWasNewRecord: isNewRecord,
        streakError: null,
      });
    } catch (error) {
      const currentState = get();
      if (
        currentState.loadingUserId !== userId ||
        currentState.streakRequestVersion !== requestVersion
      ) {
        return;
      }

      const message = error instanceof Error ? error.message : "Unable to complete reading day.";

      set({
        streakError: message,
        isLoadingStreak: false,
        loadingUserId: null,
      });
      throw error;
    }
  },
}));
