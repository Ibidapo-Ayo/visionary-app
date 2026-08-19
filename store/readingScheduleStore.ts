import { create } from "zustand";
import type { ReadingScheduleData } from "@/types";
import { getReadingScheduleByDay } from "@/services/supabase/bible";

const getReadingScheduleKey = (planId: string, dayNumber: number) => `${planId}:${dayNumber}`;
const pendingReadingScheduleRequests = new Map<
  string,
  { promise: Promise<ReadingScheduleData | null>; token: symbol }
>();

export const useReadingScheduleStore = create<{
  readingSchedule: ReadingScheduleData | null;
  readingSchedulePlanId: string | null;
  readingScheduleDayNumber: number | null;
  isLoadingReadingSchedule: boolean;
  loadingReadingSchedulePlanId: string | null;
  loadingReadingScheduleDayNumber: number | null;
  activeReadingScheduleKey: string | null;
  readingScheduleError: string | null;
  setReadingSchedule: (
    schedule: ReadingScheduleData | null,
    planId: string | null,
    dayNumber: number | null
  ) => void;
  loadReadingSchedule: (planId: string, dayNumber: number, options?: { force?: boolean }) => Promise<ReadingScheduleData | null>;
}>((set, get) => ({
  readingSchedule: null,
  readingSchedulePlanId: null,
  readingScheduleDayNumber: null,
  isLoadingReadingSchedule: false,
  loadingReadingSchedulePlanId: null,
  loadingReadingScheduleDayNumber: null,
  activeReadingScheduleKey: null,
  readingScheduleError: null,
  setReadingSchedule: (schedule, planId, dayNumber) => {
    set({
      readingSchedule: schedule,
      readingSchedulePlanId: planId,
      readingScheduleDayNumber: dayNumber,
      readingScheduleError: null,
    });
  },
  loadReadingSchedule: async (planId, dayNumber, options) => {
    const {
      readingSchedule,
      readingSchedulePlanId,
      readingScheduleDayNumber,
      isLoadingReadingSchedule,
      loadingReadingSchedulePlanId,
      loadingReadingScheduleDayNumber,
    } = get();

    const requestKey = getReadingScheduleKey(planId, dayNumber);
    const force = options?.force ?? false;
    const hasMatchingSchedule =
      !!readingSchedule && readingSchedulePlanId === planId && readingScheduleDayNumber === dayNumber;
    const isLoadingSameKey =
      isLoadingReadingSchedule &&
      loadingReadingSchedulePlanId === planId &&
      loadingReadingScheduleDayNumber === dayNumber;

    if (hasMatchingSchedule && !force) {
      return readingSchedule;
    }

    if (!force) {
      const existingRequest = pendingReadingScheduleRequests.get(requestKey);
      if (existingRequest) {
        return existingRequest.promise;
      }
    }

    if (isLoadingSameKey && hasMatchingSchedule && !force) {
      return readingSchedule;
    }

    const shouldClearStaleSchedule = !!readingSchedule && !hasMatchingSchedule;

    set({
      ...(shouldClearStaleSchedule
        ? {
            readingSchedule: null,
            readingSchedulePlanId: null,
            readingScheduleDayNumber: null,
          }
        : {}),
      isLoadingReadingSchedule: true,
      loadingReadingSchedulePlanId: planId,
      loadingReadingScheduleDayNumber: dayNumber,
      activeReadingScheduleKey: requestKey,
      readingScheduleError: null,
    });

    const requestToken = Symbol(requestKey);
    const requestPromise: Promise<ReadingScheduleData | null> = (async () => {
      try {
        const schedule = await getReadingScheduleByDay(planId, dayNumber);

        if (get().activeReadingScheduleKey !== requestKey) {
          const currentState = get();

          return currentState.readingSchedulePlanId === planId &&
            currentState.readingScheduleDayNumber === dayNumber
            ? currentState.readingSchedule
            : null;
        }

        set({
          readingSchedule: schedule,
          readingSchedulePlanId: planId,
          readingScheduleDayNumber: dayNumber,
          isLoadingReadingSchedule: false,
          loadingReadingSchedulePlanId: null,
          loadingReadingScheduleDayNumber: null,
        });

        return schedule;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load reading schedule.";

        if (get().activeReadingScheduleKey === requestKey) {
          set({
            readingScheduleError: message,
            isLoadingReadingSchedule: false,
            loadingReadingSchedulePlanId: null,
            loadingReadingScheduleDayNumber: null,
          });
        }

        throw error;
      } finally {
        const activeRequest = pendingReadingScheduleRequests.get(requestKey);
        if (activeRequest?.token === requestToken) {
          pendingReadingScheduleRequests.delete(requestKey);
        }
      }
    })();

    pendingReadingScheduleRequests.set(requestKey, {
      promise: requestPromise,
      token: requestToken,
    });
    return requestPromise;
  },
}));