import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BibleJourneyStore, DailyReadingProgress } from '@/types/index';

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateKey = () => toDateKey(new Date());

const getDefaultDailyProgress = (dateKey: string): DailyReadingProgress => ({
  dateKey,
  morningCompleted: false,
  eveningCompleted: false,
  dailyCompleted: false,
  reflectionCompletedByPeriod: {},
  completedChaptersByPeriod: {},
  reactions: {},
  reflections: {},
  completedAtByPeriod: {},
  readingReferenceByPeriod: {},
});

const dateDiffInDays = (fromDateKey: string, toDateKey: string) => {
  const from = new Date(`${fromDateKey}T00:00:00`);
  const to = new Date(`${toDateKey}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
};

const computeDailyCompleted = (progress: DailyReadingProgress) =>
  Boolean(
    progress.morningCompleted &&
      progress.eveningCompleted &&
      progress.reflectionCompletedByPeriod?.morning &&
      progress.reflectionCompletedByPeriod?.evening,
  );

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
      markReflectionCompleteForToday: ({ period }) => {
        const dateKey = getDateKey();

        set((state) => {
          const dailyProgressByDate = state.dailyProgressByDate ?? {};
          const todayState = dailyProgressByDate[dateKey] ?? getDefaultDailyProgress(dateKey);

          const nextProgress: DailyReadingProgress = {
            ...todayState,
            reflectionCompletedByPeriod: {
              ...todayState.reflectionCompletedByPeriod,
              [period]: true,
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
      isReflectionCompleteForToday: (period) => {
        const dateKey = getDateKey();
        const dailyProgressByDate = get().dailyProgressByDate ?? {};
        return Boolean(dailyProgressByDate[dateKey]?.reflectionCompletedByPeriod?.[period]);
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
      getStreakStats: () => {
        const entries = Object.values(get().dailyProgressByDate ?? {})
          .filter((entry) => entry.dailyCompleted)
          .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

        if (!entries.length) {
          return {
            currentStreak: 0,
            longestStreak: 0,
            totalCompletedDays: 0,
          };
        }

        let longest = 1;
        let running = 1;

        for (let i = 1; i < entries.length; i += 1) {
          const prev = entries[i - 1];
          const current = entries[i];
          if (dateDiffInDays(prev.dateKey, current.dateKey) === 1) {
            running += 1;
          } else {
            running = 1;
          }

          longest = Math.max(longest, running);
        }

        const completedKeySet = new Set(entries.map((entry) => entry.dateKey));
        let currentStreak = 0;
        let cursor = new Date();
        while (completedKeySet.has(toDateKey(cursor))) {
          currentStreak += 1;
          cursor.setDate(cursor.getDate() - 1);
        }

        return {
          currentStreak,
          longestStreak: longest,
          totalCompletedDays: entries.length,
        };
      },
    }),
    {
      name: 'bible-journey-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
