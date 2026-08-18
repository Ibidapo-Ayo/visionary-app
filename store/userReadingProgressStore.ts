import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserReadingProgressStore } from "@/types/index";
import {
  getCompletedScheduleDaysForUser,
  upsertUserReadingProgress,
} from "@/services/supabase/userReadingProgress";
import { getDateKeyForPlanDay, getDateRangeBounds } from "@/lib/helper";

export const calculateReadingProgressPercent = (
  totalChapters: number,
  completedChapters: number,
) => {
  if (totalChapters <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((completedChapters / totalChapters) * 100));
};

const addCompletedScheduleId = (scheduleIds: string[], scheduleId: string) => {
  if (scheduleIds.includes(scheduleId)) {
    return scheduleIds;
  }

  return [...scheduleIds, scheduleId];
};

export const useUserReadingProgressStore = create<UserReadingProgressStore>()(
  persist(
    (set, get) => ({
      completedScheduleIdsByUser: {},
      completedScheduleDaysByUser: {},
      loadedUserId: null,
      isLoadingProgress: false,
      progressError: null,
      loadUserReadingProgress: async (supabaseUserId, options) => {
        const { loadedUserId, isLoadingProgress } = get();
        const force = options?.force ?? false;

        if (isLoadingProgress) {
          return;
        }

        set({ isLoadingProgress: true, progressError: null });

        try {
          if (loadedUserId === supabaseUserId && !force) {
            set({ isLoadingProgress: false });
            return;
          }

          const completedScheduleDays =
            await getCompletedScheduleDaysForUser(supabaseUserId);
          const completedScheduleIds = completedScheduleDays.map(
            (row) => row.scheduleId,
          );

          set((state) => ({
            completedScheduleIdsByUser: {
              ...state.completedScheduleIdsByUser,
              [supabaseUserId]: completedScheduleIds,
            },
            completedScheduleDaysByUser: {
              ...state.completedScheduleDaysByUser,
              [supabaseUserId]: completedScheduleDays,
            },
            loadedUserId: supabaseUserId,
            isLoadingProgress: false,
          }));
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load reading progress.";

          set({
            progressError: message,
            isLoadingProgress: false,
          });

          throw error;
        }
      },
      markScheduleComplete: async ({ supabaseUserId, scheduleId }) => {
        const cachedUserScheduleIds =
          get().completedScheduleIdsByUser[supabaseUserId] ?? [];

        if (cachedUserScheduleIds.includes(scheduleId)) {
          return;
        }

        set((state) => ({
          completedScheduleIdsByUser: {
            ...state.completedScheduleIdsByUser,
            [supabaseUserId]: addCompletedScheduleId(
              state.completedScheduleIdsByUser[supabaseUserId] ?? [],
              scheduleId,
            ),
          },
          loadedUserId: supabaseUserId,
          progressError: null,
        }));

        try {
          await upsertUserReadingProgress({
            userId: supabaseUserId,
            scheduleId,
          });
        } catch (error) {
          console.log("Error upserting user reading progress:", error);
          set((state) => ({
            completedScheduleIdsByUser: {
              ...state.completedScheduleIdsByUser,
              [supabaseUserId]:
                state.completedScheduleIdsByUser[supabaseUserId]?.filter(
                  (id) => id !== scheduleId,
                ) ?? [],
            },
            progressError:
              error instanceof Error
                ? error.message
                : "Unable to update reading progress.",
          }));

          throw error;
        }
      },
      getCompletedScheduleCount: (scheduleIds) => {
        const { completedScheduleIdsByUser, loadedUserId } = get();

        if (!loadedUserId) {
          return 0;
        }

        const completedScheduleIds = new Set(
          completedScheduleIdsByUser[loadedUserId] ?? [],
        );
        return scheduleIds.filter((scheduleId) =>
          completedScheduleIds.has(scheduleId),
        ).length;
      },
      getTotalCompletedChapters: () => {
        const { completedScheduleIdsByUser, loadedUserId } = get();

        if (!loadedUserId) {
          return 0;
        }

        return completedScheduleIdsByUser[loadedUserId]?.length ?? 0;
      },
      isScheduleComplete: (scheduleId) => {
        const { completedScheduleIdsByUser, loadedUserId } = get();

        if (!loadedUserId) {
          return false;
        }

        return (
          completedScheduleIdsByUser[loadedUserId]?.includes(scheduleId) ??
          false
        );
      },
      getProgressStatsForRange: (range, planStartDate) => {
        const { completedScheduleDaysByUser, loadedUserId } = get();

        if (!loadedUserId || !planStartDate) {
          return { daysRead: 0, chapters: 0 };
        }

        const scheduleDays = completedScheduleDaysByUser[loadedUserId] ?? [];
        const { start, end } = getDateRangeBounds(range);
        const dateKeysInRange = new Set<string>();
        let chapters = 0;

        scheduleDays.forEach(({ dayNumber }) => {
          const dateKey = getDateKeyForPlanDay(planStartDate, dayNumber);
          if (dateKey >= start && dateKey <= end) {
            chapters += 1;
            dateKeysInRange.add(dateKey);
          }
        });

        return { daysRead: dateKeysInRange.size, chapters };
      },
    }),
    {
      name: "user-reading-progress-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedScheduleIdsByUser: state.completedScheduleIdsByUser,
        completedScheduleDaysByUser: state.completedScheduleDaysByUser,
      }),
    },
  ),
);
