import { create } from "zustand";
import type { StreakRecord } from "@/types/index";
import { completeReadingDay as requestCompleteReadingDay, getStreakForUser } from "@/services/supabase/streaks";

type StreakStore = {
  streak: StreakRecord | null;
  loadedUserId: string | null;
  isLoadingStreak: boolean;
  streakError: string | null;
  loadStreak: (userId: string, options?: { force?: boolean }) => Promise<void>;
  completeReadingDay: (userId: string) => Promise<void>;
};

export const useStreakStore = create<StreakStore>((set, get) => ({
  streak: null,
  loadedUserId: null,
  isLoadingStreak: false,
  streakError: null,
  loadStreak: async (userId, options) => {
    const { isLoadingStreak, loadedUserId } = get();
    const force = options?.force ?? false;

    if (isLoadingStreak || (loadedUserId === userId && !force)) {
      return;
    }

    set({ isLoadingStreak: true, streakError: null });

    try {
      const streak = await getStreakForUser(userId);
      set({ streak, loadedUserId: userId, isLoadingStreak: false });
    } catch (error) {
      set({
        streakError: error instanceof Error ? error.message : "Unable to load streak.",
        isLoadingStreak: false,
      });
    }
  },
  completeReadingDay: async (userId) => {
    try {
      const streak = await requestCompleteReadingDay(userId);
      set({ streak, loadedUserId: userId });
    } catch (error) {
      console.warn("Unable to complete reading day:", error);
    }
  },
}));
