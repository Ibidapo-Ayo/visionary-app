import { create } from 'zustand';
import type { ReadingPeriod, ReadingScheduleData } from '@/types/index';

/** Reading periods must be completed in this order; a period unlocks once the one before it is fully read. */
const PERIOD_ORDER: ReadingPeriod[] = ['morning', 'evening'];

interface ReadingPeriodLockState {
  isPeriodComplete: (
    period: ReadingPeriod,
    schedule: ReadingScheduleData | null,
    completedScheduleIds: Set<string>,
  ) => boolean;
  isPeriodUnlocked: (
    period: ReadingPeriod,
    schedule: ReadingScheduleData | null,
    completedScheduleIds: Set<string>,
  ) => boolean;
}

export const useReadingPeriodLockStore = create<ReadingPeriodLockState>()(() => ({
  isPeriodComplete: (period, schedule, completedScheduleIds) => {
    if (!schedule) {
      return false;
    }

    const chapters = schedule?.[period] ?? [];

    if (chapters.length === 0) {
      return true;
    }

    return chapters.every((chapter) => completedScheduleIds.has(chapter.id));
  },
  isPeriodUnlocked: (period, schedule, completedScheduleIds) => {
    const periodIndex = PERIOD_ORDER.indexOf(period);

    if (periodIndex <= 0) {
      return true;
    }

    const previousPeriod = PERIOD_ORDER[periodIndex - 1];
    const previousChapters = schedule?.[previousPeriod] ?? [];

    if (previousChapters.length === 0) {
      return true;
    }

    return previousChapters.every((chapter) => completedScheduleIds.has(chapter.id));
  },
}));
