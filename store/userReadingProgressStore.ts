import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserReadingProgressStore } from "@/types/index";
import {
  getCompletedUserReadingProgress,
  upsertUserReadingProgress,
} from "@/services/supabase/userReadingProgress";

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
      loadedUserId: null,
      isLoadingProgress: false,
      progressError: null,
      loadUserReadingProgress: async (supabaseUserId) => {
        const { loadedUserId, isLoadingProgress } = get();

        if (isLoadingProgress) {
          return;
        }

        set({ isLoadingProgress: true, progressError: null });

        try {
          if (loadedUserId === supabaseUserId) {
            set({ isLoadingProgress: false });
            return;
          }

          const progressRows =
            await getCompletedUserReadingProgress(supabaseUserId);
          const completedScheduleIds = progressRows.map(
            (row) => row.schedule_id,
          );

          set((state) => ({
            completedScheduleIdsByUser: {
              ...state.completedScheduleIdsByUser,
              [supabaseUserId]: completedScheduleIds,
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
    }),
    {
      name: "user-reading-progress-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedScheduleIdsByUser: state.completedScheduleIdsByUser,
      }),
    },
  ),
);
