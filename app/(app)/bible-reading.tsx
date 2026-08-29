import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DayReading, ReadingPeriod } from '@/types/index';
import { useAuthStore } from '@/store/authStore';
import { useUserReadingProgressStore } from '@/store/userReadingProgressStore';
import { useReadingPeriodLockStore } from '@/store/readingPeriodLockStore';
import { formatDayReadingReference } from '@/lib/helper';
import { useBibleChapter } from '@/hooks/useBibleChapter';
import { useTodayReadingSchedule } from '@/hooks/useTodayReadingSchedule';
import { useUserReadingProgress } from '@/hooks/useUserReadingProgress';
import { useReadingPeriodLock } from '@/hooks/useReadingPeriodLock';
import { useStreak } from '@/hooks/useStreak';
import BrandedSpinner from '@/components/BrandedSpinner';

interface BibleChapterSectionProps {
  reading: DayReading;
}

const BibleChapterSection = ({ reading }: BibleChapterSectionProps) => {
  const chapterQuery = useBibleChapter(reading.bookName, reading.chapter);
  const reference = formatDayReadingReference(reading);

  return (
    <Animated.View entering={FadeInDown.delay(60 + reading.orderNumber * 40).duration(280)} className="mb-7 overflow-hidden rounded-[24px] bg-white px-5 py-5">
      <Text className="text-[22px] font-black text-[#171717]">{reference}</Text>
      <Text className="mt-1 text-[10px] font-bold uppercase tracking-[0.8px] text-[#9B9085]">{chapterQuery.data?.translation_name}</Text>

      {chapterQuery.isLoading || chapterQuery.isFetching ? (
        <View className="mt-6 flex-row items-center rounded-[18px] bg-[#FFF7EF] px-4 py-4">
          <BrandedSpinner size={30} />
          <Text className="ml-3 text-[12px] font-bold text-[#8A5A2B]">Loading {reference}</Text>
        </View>
      ) : chapterQuery.isError ? (
        <View className="mt-5 rounded-[18px] border border-[#F3D2C7] bg-[#FFF5F1] px-4 py-4">
          <Text className="text-[13px] font-bold leading-5 text-[#9A3412]">Unable to load {reference}.</Text>
          <TouchableOpacity onPress={() => void chapterQuery.refetch()} activeOpacity={0.86} className="mt-3 self-start rounded-full bg-[#FF7A00] px-4 py-2.5">
            <Text className="text-[11px] font-black text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mt-5">
          {chapterQuery.data?.verses.map((verse) => (
            <View key={`${verse.book_id}-${verse.chapter}-${verse.verse}`} className="mb-4 flex-row items-start">
              <Text className="mr-2 min-w-[22px] pt-0.5 text-right text-[10px] font-black text-[#FF7A00]">{verse.verse}</Text>
              <Text className="flex-1 text-[15px] font-medium leading-[27px] text-[#24211E]">{verse.text.trim()}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const BibleReadingScreenView = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reference?: string; period?: string }>();

  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';
  const incomingReference = typeof params.reference === 'string' ? params.reference : '';

  const {
    bibleReadingPlan,
    bibleReadingPlanDayNumber,
    readingSchedule,
    isLoadingReadingSchedule,
    isLoadingBibleReadingPlan,
  } = useTodayReadingSchedule();
  const { completedScheduleIds, markScheduleComplete } = useUserReadingProgress();
  const { completeReadingDay } = useStreak();
  const { isUnlocked } = useReadingPeriodLock();
  const clerkUserId = useAuthStore((state) => state.user?.id);
  const resolveSupabaseUserId = useAuthStore((state) => state.resolveSupabaseUserId);
  const isSessionLocked = !isUnlocked(period);

  const sessionChapters = readingSchedule?.[period] ?? [];

  const initialChapterIndex = useMemo(() => {
    if (incomingReference) {
      const explicitIndex = sessionChapters.findIndex((chapter) => formatDayReadingReference(chapter) === incomingReference);
      if (explicitIndex >= 0) {
        return explicitIndex;
      }
    }

    const firstIncomplete = sessionChapters.findIndex((chapter) => !completedScheduleIds.has(chapter.id));
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  }, [completedScheduleIds, incomingReference, sessionChapters]);

  const [chapterIndex, setChapterIndex] = useState(0);
  const [isCompletingChapter, setIsCompletingChapter] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const hasAppliedInitialChapterRef = useRef(false);
  const hasUserChangedChapterRef = useRef(false);
  const selectionSignatureRef = useRef('');

  const scheduleIdentity = `${bibleReadingPlan?.id ?? 'no-plan'}:${bibleReadingPlanDayNumber ?? 'no-day'}`;
  const selectionSignature = `${scheduleIdentity}:${period}:${incomingReference}`;

  useEffect(() => {
    if (selectionSignatureRef.current === selectionSignature) {
      return;
    }

    selectionSignatureRef.current = selectionSignature;
    hasAppliedInitialChapterRef.current = false;
    hasUserChangedChapterRef.current = false;
  }, [selectionSignature]);

  useEffect(() => {
    if (isLoadingReadingSchedule || isLoadingBibleReadingPlan) {
      return;
    }

    if (sessionChapters.length === 0) {
      return;
    }

    if (hasAppliedInitialChapterRef.current || hasUserChangedChapterRef.current) {
      return;
    }

    setChapterIndex(initialChapterIndex);
    hasAppliedInitialChapterRef.current = true;
  }, [initialChapterIndex, isLoadingBibleReadingPlan, isLoadingReadingSchedule, sessionChapters.length]);

  const chapter = sessionChapters[Math.min(chapterIndex, Math.max(0, sessionChapters.length - 1))];
  const currentChapterQuery = useBibleChapter(chapter?.bookName ?? null, chapter?.chapter ?? null);
  const chapterPosition = chapterIndex + 1;
  const totalChapters = sessionChapters.length;
  const currentReference = chapter ? formatDayReadingReference(chapter) : incomingReference;
  const currentTranslationName = currentChapterQuery.data?.translation_name ?? 'Bible translation';

  const hasPrev = chapterIndex > 0;
  const hasNext = chapterIndex < totalChapters - 1;

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/bible-journey');
  };

  const markCurrentChapterComplete = async () => {
    if (!chapter) {
      throw new Error('No chapter selected to complete.');
    }

    await markScheduleComplete(chapter.id);
  };

  const goToPreviousChapter = () => {
    if (!hasPrev) {
      return;
    }

    hasUserChangedChapterRef.current = true;
    setChapterIndex((prev) => prev - 1);
  };

  const goToNextChapter = async () => {
    if (!chapter || isCompletingChapter) {
      return;
    }

    setIsCompletingChapter(true);
    setCompletionError(null);

    try {
      await markCurrentChapterComplete();

      if (hasNext) {
        hasUserChangedChapterRef.current = true;
        setChapterIndex((prev) => prev + 1);
        return;
      }

      const completedReference = formatDayReadingReference(chapter);

      // Check the real DB-backed completion state (not the locally-mirrored flags above) so the
      // streak reliably updates the moment both sessions are actually done, even across devices/reinstalls.
      // Streak sync is best-effort here — it must never block the user from seeing the completion screen.
      try {
        const resolvedUserId = clerkUserId ? await resolveSupabaseUserId(clerkUserId) : null;
        const freshCompletedIds = resolvedUserId
          ? new Set(useUserReadingProgressStore.getState().completedScheduleIdsByUser[resolvedUserId] ?? [])
          : completedScheduleIds;
        const { isPeriodComplete } = useReadingPeriodLockStore.getState();
        const bothSessionsComplete =
          isPeriodComplete('morning', readingSchedule, freshCompletedIds) &&
          isPeriodComplete('evening', readingSchedule, freshCompletedIds);

        if (bothSessionsComplete) {
          await completeReadingDay();
        }
      } catch (streakError) {
        console.warn('Unable to sync streak:', streakError);
      }

      router.replace({
        pathname: '/(app)/reading-complete',
        params: { period, reference: completedReference },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete this chapter. Please retry.';

      setCompletionError(message);
      console.warn('Unable to complete chapter:', error);
    } finally {
      setIsCompletingChapter(false);
    }
  };

  if (isSessionLocked) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF9F1] px-6">
        <StatusBar barStyle="dark-content" />
        <View className="w-full items-center rounded-[24px] bg-[#151719] px-6 py-8">
          <View className="h-16 w-16 items-center justify-center rounded-full border-[5px] border-[#FF8A18] bg-[#242628]">
            <Feather name="lock" size={22} color="#FF7A00" />
          </View>
          <Text className="mt-5 text-[18px] font-black text-white">Evening Reading is locked</Text>
          <Text className="mt-2 text-center text-[12px] font-semibold leading-5 text-[#D8D1C8]">
            Finish every chapter in your morning session first. Evening unlocks automatically right after.
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: '/(app)/bible-reading-select',
                params: { period: 'morning' },
              })
            }
            activeOpacity={0.88}
            className="mt-6 flex-row items-center rounded-[16px] bg-[#FF7A00] px-5 py-3.5"
          >
            <Feather name="sunrise" size={16} color="#FFFFFF" />
            <Text className="ml-2 text-[12px] font-black text-white">Go to Morning Reading</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF9F1] px-6">
        <StatusBar barStyle="dark-content" />
        {isLoadingReadingSchedule || isLoadingBibleReadingPlan ? (
          <View className="items-center">
            <BrandedSpinner size={38} />
            <Text className="mt-4 text-center text-[15px] font-semibold text-[#2D241B]">Loading your assigned reading.</Text>
          </View>
        ) : (
          <Text className="text-center text-[15px] font-semibold text-[#2D241B]">No chapters assigned for this session.</Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFF9F1]">
      <StatusBar barStyle="dark-content" />

      <View className="px-5 pb-2" style={{ paddingTop: insets.top + 10 }}>
        <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.82} className="h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Feather name="chevron-left" size={21} color="#1C1C1C" />
          </TouchableOpacity>

          <View className="mx-2 flex-1 items-center">
            <Text numberOfLines={1} className="text-[14px] font-black text-[#171717]">{currentReference}</Text>
            <Text numberOfLines={1} className="mt-0.5 text-[9px] font-semibold text-[#8A8176]">{currentTranslationName}</Text>
          </View>

          <View className="flex-row shrink-0 items-center">
            <TouchableOpacity activeOpacity={0.8} className="h-10 w-8 items-center justify-center">
              <Feather name="book-open" size={16} color="#1C1C1C" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} className="h-10 w-8 items-center justify-center">
              <Feather name="search" size={16} color="#1C1C1C" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 112) }} className="px-5">
        <Animated.View entering={FadeInDown.delay(40).duration(240)} className="pb-3 pt-3">
          <Text className="text-[11px] font-black uppercase tracking-[0.9px] text-[#B36A22]">{period} session</Text>
          <Text className="mt-1 text-[26px] font-black text-[#171717]">Today's Scripture</Text>
          <Text className="mt-2 text-[12px] font-semibold leading-5 text-[#81786E]">
            Let today's passages shape a steady rhythm of worship, wisdom, and obedience.
          </Text>
        </Animated.View>

        {completionError ? (
          <View className="mb-4 rounded-[16px] border border-[#F3D2C7] bg-[#FFF5F1] px-4 py-4">
            <Text className="text-[12px] font-semibold leading-5 text-[#9A3412]">{completionError}</Text>
            <TouchableOpacity
              onPress={() => void goToNextChapter()}
              disabled={isCompletingChapter}
              activeOpacity={0.86}
              className="mt-3 self-start rounded-full bg-[#FF7A00] px-4 py-2.5"
              style={{ opacity: isCompletingChapter ? 0.65 : 1 }}
            >
              <Text className="text-[11px] font-black text-white">Retry completion</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <BibleChapterSection key={chapter.id} reading={chapter} />
      </ScrollView>

      <View className="absolute left-0 right-0 px-5" style={{ bottom: Math.max(insets.bottom + 10, 18) }}>
        <Animated.View entering={FadeInDown.delay(120).duration(280)}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={goToPreviousChapter}
              disabled={!hasPrev}
              activeOpacity={0.82}
              className="h-12 w-12 items-center justify-center rounded-full bg-white"
              style={{ opacity: hasPrev ? 1 : 0.45 }}
            >
              <Feather name="chevron-left" size={20} color="#1C1C1C" />
            </TouchableOpacity>

            <View className="rounded-full bg-[#FFF2E3] px-5 py-2.5">
              <Text className="text-[11px] font-black text-[#9A6941]">
                {chapterPosition} / {totalChapters}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => void goToNextChapter()}
              disabled={isCompletingChapter}
              activeOpacity={0.9}
              className="h-12 w-12 items-center justify-center rounded-full bg-[#FF7A00]"
              style={{ opacity: isCompletingChapter ? 0.7 : 1 }}
            >
              {isCompletingChapter ? <BrandedSpinner size={18} /> : <Feather name="arrow-right" size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const BibleReadingScreen = () => {
  return <BibleReadingScreenView />;
};

export default BibleReadingScreen;
