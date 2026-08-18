import { create } from "zustand";
import type { ReadingScheduleData } from "@/types";
import { getReadingScheduleByDay } from "@/services/supabase/bible";

export const useReadingScheduleStore = create<{
  readingSchedule: ReadingScheduleData | null;
  readingScheduleDayNumber: number | null;
  isLoadingReadingSchedule: boolean;
  readingScheduleError: string | null;
  setReadingSchedule: (schedule: ReadingScheduleData | null, dayNumber: number | null) => void;
  loadReadingSchedule: (planId: string, dayNumber: number, options?: { force?: boolean }) => Promise<ReadingScheduleData | null>;
}>((set, get) => ({
  readingSchedule: null,
  readingScheduleDayNumber: null,
  isLoadingReadingSchedule: false,
  readingScheduleError: null,
  setReadingSchedule: (schedule, dayNumber) => {
    set({
      readingSchedule: schedule,
      readingScheduleDayNumber: dayNumber,
      readingScheduleError: null,
    });
  },
  loadReadingSchedule: async (planId, dayNumber, options) => {
    const { readingSchedule, readingScheduleDayNumber, isLoadingReadingSchedule } = get();
    const force = options?.force ?? false;

    if (readingSchedule && readingScheduleDayNumber === dayNumber && !force) {
      return readingSchedule;
    }

    if (isLoadingReadingSchedule) {
      return readingSchedule;
    }

    set({ isLoadingReadingSchedule: true, readingScheduleError: null });

    try {
      const schedule = await getReadingScheduleByDay(planId, dayNumber);
      set({
        readingSchedule: schedule,
        readingScheduleDayNumber: dayNumber,
        isLoadingReadingSchedule: false,
      });

      return schedule;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load reading schedule.";

      set({
        readingScheduleError: message,
        isLoadingReadingSchedule: false,
      });

      throw error;
    }
  },
}));