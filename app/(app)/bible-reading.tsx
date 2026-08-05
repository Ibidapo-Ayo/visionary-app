import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockBibleJourneySessionPlan, mockBibleReadingChapters } from '@services/mockData';
import type { ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

const BibleReadingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reference?: string; period?: string }>();

  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';
  const incomingReference = typeof params.reference === 'string' ? params.reference : '';

  const markChapterCompleteForToday = useBibleJourneyStore((state) => state.markChapterCompleteForToday);
  const getCompletedChaptersForToday = useBibleJourneyStore((state) => state.getCompletedChaptersForToday);
  const markSessionReadingCompleteForToday = useBibleJourneyStore((state) => state.markSessionReadingCompleteForToday);

  const assignedReferences = period === 'morning' ? mockBibleJourneySessionPlan.morning : mockBibleJourneySessionPlan.evening;

  const sessionChapters = useMemo(
    () =>
      assignedReferences
        .map((reference) => mockBibleReadingChapters.find((chapter) => chapter.reference === reference))
        .filter((chapter): chapter is (typeof mockBibleReadingChapters)[number] => Boolean(chapter)),
    [assignedReferences],
  );

  const completedReferences = getCompletedChaptersForToday(period);

  const initialChapterIndex = useMemo(() => {
    if (incomingReference) {
      const explicitIndex = sessionChapters.findIndex((chapter) => chapter.reference === incomingReference);
      if (explicitIndex >= 0) {
        return explicitIndex;
      }
    }

    const firstIncomplete = sessionChapters.findIndex((chapter) => !completedReferences.includes(chapter.reference));
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  }, [completedReferences, incomingReference, sessionChapters]);

  const [chapterIndex, setChapterIndex] = useState(initialChapterIndex);

  const chapter = sessionChapters[Math.min(chapterIndex, Math.max(0, sessionChapters.length - 1))];
  const chapterPosition = chapterIndex + 1;
  const totalChapters = sessionChapters.length;

  const hasPrev = chapterIndex > 0;
  const hasNext = chapterIndex < totalChapters - 1;

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/bible-journey');
  };

  const markCurrentChapterComplete = () => {
    if (!chapter) {
      return;
    }

    markChapterCompleteForToday({
      period,
      chapterReference: chapter.reference,
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

    markCurrentChapterComplete();

    if (hasNext) {
      setChapterIndex((prev) => prev + 1);
      return;
    }

    markSessionReadingCompleteForToday({
      period,
      readingReference: chapter.reference,
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
        <Text className="text-center text-[15px] font-semibold text-[#2D241B]">No chapters assigned for this session.</Text>
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
            <Text className="text-[14px] font-black text-[#171717]">{chapter.reference}</Text>
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
        <Animated.View entering={FadeInDown.delay(60).duration(280)} className="pt-3">
          {chapter.verses.map((verse) => (
            <Text key={`${chapter.id}-${verse.number}`} className="mb-5 text-[15px] font-medium leading-[27px] text-[#24211E]">
              <Text className="text-[11px] font-black text-[#FF7A00]">{verse.number}  </Text>
              {verse.text}
            </Text>
          ))}
        </Animated.View>
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
