import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BibleJourneyStore, DailyReadingProgress } from '@/types/index';
import { getDateRangeBounds, toDateKey } from '@/lib/helper';

const getDateKey = () => toDateKey(new Date());

const getDefaultDailyProgress = (dateKey: string): DailyReadingProgress => ({
  dateKey,
  morningCompleted: false,
  eveningCompleted: false,
  dailyCompleted: false,
  completedChaptersByPeriod: {},
  reactions: {},
  reflections: {},
  completedAtByPeriod: {},
  readingReferenceByPeriod: {},
});

const computeDailyCompleted = (progress: DailyReadingProgress) =>
  Boolean(progress.morningCompleted && progress.eveningCompleted);

export const useBibleJourneyStore = create<BibleJourneyStore>()(
  persist(
    (set, get) => ({
      dailyProgressByDate: {},
      markSessionReadingCompleteForToday: ({ period, readingReference }) => {
        const dateKey = getDateKey();
        const nowIso = new Date().toISOString();

        set((state) => {
          const dailyProgressByDate = state.dailyProgressByDate ?? {};
          const todayState = dailyProgressByDate[dateKey] ?? getDefaultDailyProgress(dateKey);

          const nextProgress: DailyReadingProgress = {
            ...todayState,
            [period === 'morning' ? 'morningCompleted' : 'eveningCompleted']: true,
            completedAtByPeriod: {
              ...todayState.completedAtByPeriod,
              [period]: todayState.completedAtByPeriod?.[period] ?? nowIso,
            },
            readingReferenceByPeriod: {
              ...todayState.readingReferenceByPeriod,
              [period]: readingReference,
            },
          };

          return {
            dailyProgressByDate: {
              ...dailyProgressByDate,
              [dateKey]: {
                ...nextProgress,
                dailyCompleted: computeDailyCompleted(nextProgress),
              },
            },
          };
        });
      },
      markPeriodCompleteForToday: ({ period, readingReference }) => {
        const dateKey = getDateKey();
        const nowIso = new Date().toISOString();

        set((state) => {
          const dailyProgressByDate = state.dailyProgressByDate ?? {};
          const todayState = dailyProgressByDate[dateKey] ?? getDefaultDailyProgress(dateKey);

          const morningCompleted = period === 'morning' ? true : todayState.morningCompleted;
          const eveningCompleted = period === 'evening' ? true : todayState.eveningCompleted;

          const nextProgress: DailyReadingProgress = {
            ...todayState,
            morningCompleted,
            eveningCompleted,
            completedAtByPeriod: {
              ...todayState.completedAtByPeriod,
              [period]: todayState.completedAtByPeriod?.[period] ?? nowIso,
            },
            readingReferenceByPeriod: {
              ...todayState.readingReferenceByPeriod,
              [period]: readingReference,
            },
          };

          return {
            dailyProgressByDate: {
              ...dailyProgressByDate,
              [dateKey]: {
                ...nextProgress,
                dailyCompleted: computeDailyCompleted(nextProgress),
              },
            },
          };
        });
      },
      completeReadingForToday: ({ period, reaction, reflection, readingReference }) => {
        const dateKey = getDateKey();
        const nowIso = new Date().toISOString();

        set((state) => {
          const dailyProgressByDate = state.dailyProgressByDate ?? {};
          const todayState = dailyProgressByDate[dateKey] ?? getDefaultDailyProgress(dateKey);

          const nextProgress: DailyReadingProgress = {
            ...todayState,
            [period === 'morning' ? 'morningCompleted' : 'eveningCompleted']: true,
            reactions: {
              ...todayState.reactions,
              [period]: reaction,
            },
            reflections: {
              ...todayState.reflections,
              [period]: (reflection ?? '').trim(),
            },
            completedAtByPeriod: {
              ...todayState.completedAtByPeriod,
              [period]: nowIso,
            },
            readingReferenceByPeriod: {
              ...todayState.readingReferenceByPeriod,
              [period]: readingReference,
            },
          };

          return {
            dailyProgressByDate: {
              ...dailyProgressByDate,
              [dateKey]: {
                ...nextProgress,
                dailyCompleted: computeDailyCompleted(nextProgress),
              },
            },
          };
        });
      },
      markChapterCompleteForToday: ({ period, chapterReference }) => {
        const dateKey = getDateKey();

        set((state) => {
          const dailyProgressByDate = state.dailyProgressByDate ?? {};
          const todayState = dailyProgressByDate[dateKey] ?? getDefaultDailyProgress(dateKey);
          const currentCompleted = todayState.completedChaptersByPeriod?.[period] ?? [];

          if (currentCompleted.includes(chapterReference)) {
            return state;
          }

          return {
            dailyProgressByDate: {
              ...dailyProgressByDate,
              [dateKey]: {
                ...todayState,
                completedChaptersByPeriod: {
                  ...todayState.completedChaptersByPeriod,
                  [period]: [...currentCompleted, chapterReference],
                },
              },
            },
          };
        });
      },
      getCompletedChaptersForToday: (period) => {
        const dateKey = getDateKey();
        const dailyProgressByDate = get().dailyProgressByDate ?? {};
        return dailyProgressByDate[dateKey]?.completedChaptersByPeriod?.[period] ?? [];
      },
      getTodayProgress: () => {
        const dateKey = getDateKey();
        const dailyProgressByDate = get().dailyProgressByDate ?? {};
        return dailyProgressByDate[dateKey] ?? getDefaultDailyProgress(dateKey);
      },
      getProgressStatsForRange: (range) => {
        const { start, end } = getDateRangeBounds(range);
        const entries = Object.values(get().dailyProgressByDate ?? {}).filter(
          (entry) => entry.dateKey >= start && entry.dateKey <= end,
        );

        const reflections = entries.reduce((count, entry) => {
          const reflectionCount = [entry.reflections?.morning, entry.reflections?.evening].filter((reflection) =>
            Boolean(reflection?.trim()),
          ).length;

          return count + reflectionCount;
        }, 0);

        return { reflections };
      },
    }),
    {
      name: 'bible-journey-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState;
        }

        const state = persistedState as {
          dailyProgressByDate?: Record<string, DailyReadingProgress & { reflectionCompleted?: unknown }>;
        };

        const dailyProgressByDate = state.dailyProgressByDate ?? {};
        const migratedDailyProgressByDate = Object.fromEntries(
          Object.entries(dailyProgressByDate).map(([dateKey, progress]) => {
            const { reflectionCompleted: _reflectionCompleted, ...rest } = progress;
            const nextProgress: DailyReadingProgress = {
              ...rest,
              dailyCompleted: computeDailyCompleted(rest),
            };

            return [dateKey, nextProgress];
          }),
        );

        return {
          ...state,
          dailyProgressByDate: migratedDailyProgressByDate,
        };
      },
    },
  ),
);
