import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserReadingProgressStore } from "@/types/index";
import {
  getCompletedScheduleDaysForUser,
  getScheduleDayMetadata,
  upsertUserReadingProgress,
} from "@/services/supabase/userReadingProgress";
import { getDateKeyForPlanDay, getDateRangeBounds } from "@/lib/helper";
import type { CompletedScheduleDay } from "@/types/index";

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

const addCompletedScheduleDay = (
  completedScheduleDays: CompletedScheduleDay[],
  entry: CompletedScheduleDay,
) => {
  if (completedScheduleDays.some((day) => day.scheduleId === entry.scheduleId)) {
    return completedScheduleDays;
  }

  return [...completedScheduleDays, entry];
};

export const useUserReadingProgressStore = create<UserReadingProgressStore>()(
  persist(
    (set, get) => ({
      completedScheduleIdsByUser: {},
      completedScheduleDaysByUser: {},
      loadedUserId: null,
      loadingUserId: null,
      isLoadingProgress: false,
      progressError: null,
      loadUserReadingProgress: async (supabaseUserId, options) => {
        const { loadedUserId, loadingUserId } = get();
        const force = options?.force ?? false;

        if (loadedUserId === supabaseUserId && !force) {
          return;
        }

        if (loadingUserId === supabaseUserId) {
          return;
        }

        set({ isLoadingProgress: true, loadingUserId: supabaseUserId, progressError: null });

        try {
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
            loadingUserId: null,
          }));
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load reading progress.";

          set({
            progressError: message,
            isLoadingProgress: false,
            loadingUserId: null,
          });

          throw error;
        }
      },
      markScheduleComplete: async ({ supabaseUserId, scheduleId, dayNumber, session }) => {
        const cachedUserScheduleIds =
          get().completedScheduleIdsByUser[supabaseUserId] ?? [];

        if (cachedUserScheduleIds.includes(scheduleId)) {
          return;
        }

        const resolvedMetadata =
          dayNumber !== undefined && session
            ? { dayNumber, session }
            : await getScheduleDayMetadata(scheduleId);

        const optimisticDayEntry: CompletedScheduleDay = {
          scheduleId,
          dayNumber: resolvedMetadata.dayNumber,
          session: resolvedMetadata.session,
        };

        set((state) => ({
          completedScheduleIdsByUser: {
            ...state.completedScheduleIdsByUser,
            [supabaseUserId]: addCompletedScheduleId(
              state.completedScheduleIdsByUser[supabaseUserId] ?? [],
              scheduleId,
            ),
          },
          completedScheduleDaysByUser: {
            ...state.completedScheduleDaysByUser,
            [supabaseUserId]: addCompletedScheduleDay(
              state.completedScheduleDaysByUser[supabaseUserId] ?? [],
              optimisticDayEntry,
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
            completedScheduleDaysByUser: {
              ...state.completedScheduleDaysByUser,
              [supabaseUserId]:
                state.completedScheduleDaysByUser[supabaseUserId]?.filter(
                  (entry) => entry.scheduleId !== scheduleId,
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
        loadedUserId: state.loadedUserId,
      }),
    },
  ),
);
