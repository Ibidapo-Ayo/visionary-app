import React, { useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { mockBibleJourneySessionPlan, mockBibleReadingChapters } from '@services/mockData';
import { ReadingPeriod, useBibleJourneyStore } from '@store/bibleJourneyStore';

const BibleReadingScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
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

    markChapterCompleteForToday({
      period,
      chapterReference: chapter.reference,
    });

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
      <LinearGradient colors={['#060606', '#0A0A09', '#10110F']} className="flex-1 items-center justify-center px-6">
        <StatusBar barStyle="light-content" />
        <Text className="text-center text-[15px] font-semibold text-[#F0F0F0]">No chapters assigned for this session.</Text>
      </LinearGradient>
    );
  }

  const gradient = isDark
    ? (['#060606', '#0A0A09', '#10110F'] as const)
    : (['#F8F4EE', '#F4EEE6', '#F0EADF'] as const);

  const panelBg = isDark ? '#121212' : '#FFF8EE';
  const borderColor = isDark ? '#2C2C2C' : '#E2D5C5';
  const titleColor = isDark ? '#F6F6F6' : '#2D241B';
  const bodyColor = isDark ? '#E3E3E3' : '#3F3024';
  const mutedColor = isDark ? '#AAAAAA' : '#7D6A58';

  return (
    <LinearGradient colors={gradient} className="flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View className="px-5 pb-3 pt-8">
        <Animated.View entering={FadeIn.duration(230)} className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor,
              backgroundColor: panelBg,
            }}
            onPress={handleBackPress}
          >
            <Feather name="chevron-left" size={18} color={titleColor} />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[16px] font-semibold" style={{ color: titleColor }}>{chapter.reference}</Text>
            <Text className="text-[11px]" style={{ color: mutedColor }}>
              {period === 'morning' ? 'Morning Reading' : 'Evening Reading'}
            </Text>
          </View>

          <View className="h-10 w-10" />
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }} className="px-5">
        <Animated.View entering={SlideInUp.duration(250)}>
          <View className="rounded-3xl border px-4 py-4" style={{ borderColor, backgroundColor: panelBg }}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1px]" style={{ color: mutedColor }}>
              Reading Progress
            </Text>
            <Text className="mt-1 text-[14px] font-semibold" style={{ color: titleColor }}>
              Chapter {chapterPosition} of {totalChapters}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(50).duration(250)} className="mt-4">
          <View className="rounded-3xl border px-5 py-5" style={{ borderColor, backgroundColor: panelBg }}>
            <Text className="text-[12px] font-semibold" style={{ color: mutedColor }}>{chapter.reference}</Text>

            {chapter.verses.map((verse) => (
              <Text key={`${chapter.id}-${verse.number}`} className="mt-3 text-[17px] leading-8" style={{ color: bodyColor }}>
                <Text className="text-[12px] font-semibold" style={{ color: mutedColor }}>{verse.number} </Text>
                {verse.text}
              </Text>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(90).duration(260)} className="mt-4 flex-row items-center justify-between gap-3">
          <TouchableOpacity
            className="flex-1 rounded-full border px-4 py-3"
            style={{
              borderColor,
              backgroundColor: panelBg,
              opacity: hasPrev ? 1 : 0.45,
            }}
            disabled={!hasPrev}
            onPress={goToPreviousChapter}
          >
            <Text className="text-center text-[12px] font-semibold" style={{ color: titleColor }}>Previous Chapter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 rounded-full bg-[#FF7A00] px-4 py-3"
            onPress={goToNextChapter}
          >
            <Text className="text-center text-[12px] font-semibold text-[#1B1309]">
              {hasNext ? 'Next Chapter' : 'Finish Reading'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BibleReadingScreen;
