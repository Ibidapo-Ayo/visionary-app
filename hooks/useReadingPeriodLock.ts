import { useMemo } from 'react';
import type { ReadingPeriod } from '@/types/index';
import { useReadingPeriodLockStore } from '@/store/readingPeriodLockStore';
import { useTodayReadingSchedule } from '@/hooks/useTodayReadingSchedule';
import { useUserReadingProgress } from '@/hooks/useUserReadingProgress';

/**
 * Single source of truth for whether the morning/evening reading sessions are unlocked
 * today. Evening only unlocks once every morning chapter is completed.
 */
export const useReadingPeriodLock = () => {
  const { readingSchedule } = useTodayReadingSchedule();
  const { completedScheduleIds } = useUserReadingProgress();
  const isPeriodComplete = useReadingPeriodLockStore((state) => state.isPeriodComplete);
  const isPeriodUnlocked = useReadingPeriodLockStore((state) => state.isPeriodUnlocked);

  return useMemo(() => {
    const morningComplete = isPeriodComplete('morning', readingSchedule, completedScheduleIds);
    const eveningComplete = isPeriodComplete('evening', readingSchedule, completedScheduleIds);
    const morningUnlocked = isPeriodUnlocked('morning', readingSchedule, completedScheduleIds);
    const eveningUnlocked = isPeriodUnlocked('evening', readingSchedule, completedScheduleIds);

    const isComplete = (period: ReadingPeriod) => (period === 'morning' ? morningComplete : eveningComplete);
    const isUnlocked = (period: ReadingPeriod) => (period === 'morning' ? morningUnlocked : eveningUnlocked);
    /** The period the user should actually be reading next, ignoring whichever one is locked. */
    const nextActionablePeriod: ReadingPeriod | null =
      morningComplete && eveningComplete ? null : !morningComplete ? 'morning' : 'evening';

    return {
      morningComplete,
      eveningComplete,
      morningUnlocked,
      eveningUnlocked,
      isComplete,
      isUnlocked,
      nextActionablePeriod,
    };
  }, [readingSchedule, completedScheduleIds, isPeriodComplete, isPeriodUnlocked]);
};
