import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ReadingScheduleData } from '@/types/index';
import { useTodayReadingSchedule } from '@/hooks/useTodayReadingSchedule';
import { getReadingScheduleByDay } from '@/services/supabase/bible';

/**
 * Loads tomorrow's schedule in isolation so today's schedule UI and lock logic remain untouched.
 */
export const useTomorrowReadingSchedule = () => {
  const { bibleReadingPlan, bibleReadingPlanDayNumber } = useTodayReadingSchedule();

  const tomorrowDayNumber = useMemo(() => {
    if (!bibleReadingPlan || bibleReadingPlanDayNumber === null) {
      return null;
    }

    if (bibleReadingPlanDayNumber >= bibleReadingPlan.total_days) {
      return null;
    }

    return bibleReadingPlanDayNumber + 1;
  }, [bibleReadingPlan, bibleReadingPlanDayNumber]);

  const tomorrowReadingQuery = useQuery<ReadingScheduleData | null>({
    queryKey: ['tomorrow-reading-schedule', bibleReadingPlan?.id, tomorrowDayNumber],
    enabled: Boolean(bibleReadingPlan?.id && tomorrowDayNumber !== null),
    queryFn: async () => {
      if (!bibleReadingPlan || tomorrowDayNumber === null) {
        return null;
      }

      return getReadingScheduleByDay(bibleReadingPlan.id, tomorrowDayNumber);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    tomorrowReadingSchedule: tomorrowReadingQuery.data ?? null,
    tomorrowDayNumber,
    isLoadingTomorrowReadingSchedule: tomorrowReadingQuery.isLoading || tomorrowReadingQuery.isFetching,
    tomorrowReadingScheduleError:
      tomorrowReadingQuery.error instanceof Error ? tomorrowReadingQuery.error.message : null,
  };
};