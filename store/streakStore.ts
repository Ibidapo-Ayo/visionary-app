import { create } from "zustand";
import type { StreakRecord } from "@/types/index";
import { completeReadingDay as requestCompleteReadingDay, syncStreakStatus } from "@/services/supabase/streaks";

type StreakStore = {
  streak: StreakRecord | null;
  loadedUserId: string | null;
  loadingUserId: string | null;
  completingUserId: string | null;
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
  completingUserId: null,
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
    const { completingUserId } = get();

    if (completingUserId === userId) {
      return;
    }

    const currentState = get();
    const hasKnownPreviousRecord = currentState.loadedUserId === userId && !!currentState.streak;
    const previousLongestStreak = hasKnownPreviousRecord ? currentState.streak?.longest_streak ?? 0 : null;

    set((state) => ({
      ...(state.loadedUserId !== userId
        ? {
            streak: null,
            loadedUserId: null,
          }
        : {}),
      completingUserId: userId,
      streakError: null,
    }));

    try {
      const streak = await requestCompleteReadingDay(userId);
      const currentState = get();
      if (currentState.completingUserId !== userId) {
        return;
      }

      const isNewRecord = previousLongestStreak !== null && streak.longest_streak > previousLongestStreak;

      set((state) => ({
        streak,
        loadedUserId: userId,
        lastCompletedUserId: userId,
        lastCompletionWasNewRecord: isNewRecord,
        streakError: null,
        completingUserId: state.completingUserId === userId ? null : state.completingUserId,
      }));
    } catch (error) {
      const currentState = get();
      if (currentState.completingUserId !== userId) {
        return;
      }

      const message = error instanceof Error ? error.message : "Unable to complete reading day.";

      set((state) => ({
        streakError: message,
        completingUserId: state.completingUserId === userId ? null : state.completingUserId,
      }));
      throw error;
    }
  },
}));
