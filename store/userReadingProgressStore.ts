import { create } from "zustand";
import type { UserReadingProgressStore } from "@/types/index";
import { useAuthStore } from "@/store/authStore";
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
    (set, get) => ({
      completedScheduleIdsByUser: {},
      completedScheduleDaysByUser: {},
      loadedUserId: null,
      loadingUserId: null,
      progressRequestVersion: 0,
      isLoadingProgress: false,
      progressError: null,
      loadUserReadingProgress: async (supabaseUserId, options) => {
        const { loadedUserId, loadingUserId, progressRequestVersion } = get();
        const force = options?.force ?? false;

        if (loadedUserId === supabaseUserId && !force) {
          return;
        }

        if (loadingUserId === supabaseUserId) {
          return;
        }

        const requestVersion = progressRequestVersion + 1;

        set({
          isLoadingProgress: true,
          loadingUserId: supabaseUserId,
          progressRequestVersion: requestVersion,
          progressError: null,
        });

        try {
          const completedScheduleDays =
            await getCompletedScheduleDaysForUser(supabaseUserId);
          const completedScheduleIds = completedScheduleDays.map(
            (row) => row.scheduleId,
          );

          const currentState = get();
          if (
            currentState.loadingUserId !== supabaseUserId ||
            currentState.progressRequestVersion !== requestVersion
          ) {
            return;
          }

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
          const currentState = get();
          if (
            currentState.loadingUserId !== supabaseUserId ||
            currentState.progressRequestVersion !== requestVersion
          ) {
            return;
          }

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

        set((state) => ({
          completedScheduleIdsByUser: {
            ...state.completedScheduleIdsByUser,
            [supabaseUserId]: addCompletedScheduleId(
              state.completedScheduleIdsByUser[supabaseUserId] ?? [],
              scheduleId,
            ),
          },
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

        // Best-effort for stats: the schedule-ID completion above already stuck even if this fails.
        try {
          const resolvedMetadata =
            dayNumber !== undefined && session
              ? { dayNumber, session }
              : await getScheduleDayMetadata(scheduleId);

          if (resolvedMetadata) {
            const completedDayEntry: CompletedScheduleDay = {
              scheduleId,
              dayNumber: resolvedMetadata.dayNumber,
              session: resolvedMetadata.session,
            };

            set((state) => ({
              completedScheduleDaysByUser: {
                ...state.completedScheduleDaysByUser,
                [supabaseUserId]: addCompletedScheduleDay(
                  state.completedScheduleDaysByUser[supabaseUserId] ?? [],
                  completedDayEntry,
                ),
              },
            }));
          }
        } catch (error) {
          console.log("Error resolving schedule day metadata:", error);
        }
      },
      getCompletedScheduleCount: (scheduleIds) => {
        const { completedScheduleIdsByUser, loadedUserId } = get();
        const activeUserId = useAuthStore.getState().supabaseUserId;
        const targetUserId = activeUserId ?? loadedUserId;

        if (!targetUserId) {
          return 0;
        }

        const completedScheduleIds = new Set(
          completedScheduleIdsByUser[targetUserId] ?? [],
        );
        return scheduleIds.filter((scheduleId) =>
          completedScheduleIds.has(scheduleId),
        ).length;
      },
      getTotalCompletedChapters: () => {
        const { completedScheduleIdsByUser, loadedUserId } = get();
        const activeUserId = useAuthStore.getState().supabaseUserId;
        const targetUserId = activeUserId ?? loadedUserId;

        if (!targetUserId) {
          return 0;
        }

        return completedScheduleIdsByUser[targetUserId]?.length ?? 0;
      },
      isScheduleComplete: (scheduleId) => {
        const { completedScheduleIdsByUser, loadedUserId } = get();
        const activeUserId = useAuthStore.getState().supabaseUserId;
        const targetUserId = activeUserId ?? loadedUserId;

        if (!targetUserId) {
          return false;
        }

        return (
          completedScheduleIdsByUser[targetUserId]?.includes(scheduleId) ??
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
);
