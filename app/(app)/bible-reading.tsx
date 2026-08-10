import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DayReading, ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';
import { useBibleReadingPlanStore } from '@/store/bible-reading-plan';
import { useReadingScheduleStore } from '@/store/readingScheduleStore';
import { useAuthStore } from '@/store/authStore';
import { useUserReadingProgressStore } from '@/store/userReadingProgressStore';
import { formatDayReadingReference } from '@/lib/helper';
import { useBibleChapter } from '@/hooks/useBibleChapter';
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
      <Text className="mt-1 text-[10px] font-bold uppercase tracking-[0.8px] text-[#9B9085]">New International Version</Text>

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

const BibleReadingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reference?: string; period?: string }>();

  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';
  const incomingReference = typeof params.reference === 'string' ? params.reference : '';

  const markSessionReadingCompleteForToday = useBibleJourneyStore((state) => state.markSessionReadingCompleteForToday);
  const bibleReadingPlan = useBibleReadingPlanStore((state) => state.bibleReadingPlan);
  const bibleReadingPlanDayNumber = useBibleReadingPlanStore((state) => state.bibleReadingPlanDayNumber);
  const loadBibleReadingPlan = useBibleReadingPlanStore((state) => state.loadBibleReadingPlan);
  const readingSchedule = useReadingScheduleStore((state) => state.readingSchedule);
  const isLoadingReadingSchedule = useReadingScheduleStore((state) => state.isLoadingReadingSchedule);
  const loadReadingSchedule = useReadingScheduleStore((state) => state.loadReadingSchedule);
  const user = useAuthStore((state) => state.user);
  const loadUserReadingProgress = useUserReadingProgressStore((state) => state.loadUserReadingProgress);
  const markScheduleComplete = useUserReadingProgressStore((state) => state.markScheduleComplete);
  const completedScheduleIdsByUser = useUserReadingProgressStore((state) => state.completedScheduleIdsByUser);
  const loadedProgressUserId = useUserReadingProgressStore((state) => state.loadedUserId);

  const sessionChapters = readingSchedule?.[period] ?? [];

  const completedScheduleIds = loadedProgressUserId ? completedScheduleIdsByUser[loadedProgressUserId] ?? [] : [];

  const initialChapterIndex = useMemo(() => {
    if (incomingReference) {
      const explicitIndex = sessionChapters.findIndex((chapter) => formatDayReadingReference(chapter) === incomingReference);
      if (explicitIndex >= 0) {
        return explicitIndex;
      }
    }

    const firstIncomplete = sessionChapters.findIndex((chapter) => !completedScheduleIds.includes(chapter.id));
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  }, [completedScheduleIds, incomingReference, sessionChapters]);

  const [chapterIndex, setChapterIndex] = useState(initialChapterIndex);

  useEffect(() => {
    if (bibleReadingPlan || bibleReadingPlanDayNumber !== null) {
      return;
    }

    void loadBibleReadingPlan().catch((error) => {
      console.warn('Unable to load Bible reading plan:', error);
    });
  }, [bibleReadingPlan, bibleReadingPlanDayNumber, loadBibleReadingPlan]);

  useEffect(() => {
    if (!bibleReadingPlan || bibleReadingPlanDayNumber === null) {
      return;
    }

    void loadReadingSchedule(bibleReadingPlan.id, bibleReadingPlanDayNumber).catch((error) => {
      console.warn('Unable to load reading schedule:', error);
    });
  }, [bibleReadingPlan, bibleReadingPlanDayNumber, loadReadingSchedule]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void loadUserReadingProgress(user.id).catch((error) => {
      console.warn('Unable to load user reading progress:', error);
    });
  }, [loadUserReadingProgress, user?.id]);

  useEffect(() => {
    setChapterIndex(initialChapterIndex);
  }, [initialChapterIndex]);

  const chapter = sessionChapters[Math.min(chapterIndex, Math.max(0, sessionChapters.length - 1))];
  const chapterPosition = chapterIndex + 1;
  const totalChapters = sessionChapters.length;
  const currentReference = chapter ? formatDayReadingReference(chapter) : incomingReference;

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
      return;
    }

    if (!user?.id) {
      return;
    }

    await markScheduleComplete({
      clerkUserId: user.id,
      scheduleId: chapter.id,
    });
  };

  const goToPreviousChapter = () => {
    if (!hasPrev) {
      return;
    }

    setChapterIndex((prev) => prev - 1);
  };

  const goToNextChapter = () => {
    if (!chapter) {
      return;
    }

    void markCurrentChapterComplete().catch((error) => {
      console.warn('Unable to update user reading progress:', error);
    });

    if (hasNext) {
      setChapterIndex((prev) => prev + 1);
      return;
    }

    markSessionReadingCompleteForToday({
      period,
      readingReference: formatDayReadingReference(chapter),
    });

    router.replace({
      pathname: '/(app)/bible-reflection-intro',
      params: { period },
    });
  };

  if (!chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF9F1] px-6">
        <StatusBar barStyle="dark-content" />
        {isLoadingReadingSchedule ? (
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
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full">
            <Feather name="chevron-left" size={21} color="#1C1C1C" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[14px] font-black text-[#171717]">{currentReference}</Text>
            <Text className="mt-0.5 text-[9px] font-semibold text-[#8A8176]">New International Version</Text>
          </View>

          <View className="flex-row items-center">
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

            <TouchableOpacity onPress={goToNextChapter} activeOpacity={0.9} className="h-12 w-12 items-center justify-center rounded-full bg-[#FF7A00]">
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default BibleReadingScreen;
