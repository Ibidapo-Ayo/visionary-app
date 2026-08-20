import { useEffect } from 'react';
import { useBibleReadingPlanStore } from '@/store/bible-reading-plan';
import { useReadingScheduleStore } from '@/store/readingScheduleStore';

/**
 * Loads (and keeps in sync) today's reading schedule for the active Bible reading plan.
 * Shared by every screen/card that needs to know today's assigned chapters.
 */
export const useTodayReadingSchedule = () => {
  const bibleReadingPlan = useBibleReadingPlanStore((state) => state.bibleReadingPlan);
  const bibleReadingPlanDayNumber = useBibleReadingPlanStore((state) => state.bibleReadingPlanDayNumber);
  const isLoadingBibleReadingPlan = useBibleReadingPlanStore((state) => state.isLoadingBibleReadingPlan);
  const readingSchedule = useReadingScheduleStore((state) => state.readingSchedule);
  const isLoadingReadingSchedule = useReadingScheduleStore((state) => state.isLoadingReadingSchedule);
  const loadReadingSchedule = useReadingScheduleStore((state) => state.loadReadingSchedule);

  useEffect(() => {
    if (!bibleReadingPlan || bibleReadingPlanDayNumber === null) {
      return;
    }

    void loadReadingSchedule(bibleReadingPlan.id, bibleReadingPlanDayNumber).catch((error) => {
      console.warn('Unable to load reading schedule:', error);
    });
  }, [bibleReadingPlan, bibleReadingPlanDayNumber, loadReadingSchedule]);

  return {
    bibleReadingPlan,
    bibleReadingPlanDayNumber,
    isLoadingBibleReadingPlan,
    readingSchedule,
    isLoadingReadingSchedule,
  };
};
