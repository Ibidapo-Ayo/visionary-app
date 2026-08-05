import React, { useMemo } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockBibleJourneySessionPlan, mockBibleReadingChapters } from '@services/mockData';
import type { ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

const BibleReadingSelectScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ period?: string }>();
  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';

  const getCompletedChaptersForToday = useBibleJourneyStore((state) => state.getCompletedChaptersForToday);
  const completedReferences = getCompletedChaptersForToday(period);

  const assignedReferences = period === 'morning' ? mockBibleJourneySessionPlan.morning : mockBibleJourneySessionPlan.evening;
  const chapters = useMemo(
    () =>
      assignedReferences
        .map((reference) => mockBibleReadingChapters.find((chapter) => chapter.reference === reference))
        .filter((chapter): chapter is (typeof mockBibleReadingChapters)[number] => Boolean(chapter)),
    [assignedReferences],
  );

  const completedCount = chapters.filter((chapter) => completedReferences.includes(chapter.reference)).length;
  const nextChapter = chapters.find((chapter) => !completedReferences.includes(chapter.reference)) ?? chapters[0];
  const sessionLabel = period === 'morning' ? 'Morning Reading' : 'Evening Reading';

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/bible-journey');
  };

  const openChapter = (reference: string) => {
    router.push({
      pathname: '/(app)/bible-reading',
      params: {
        period,
        reference,
      },
    });
  };

  return (
    <LinearGradient colors={['#FFFDF9', '#F8F2EA', '#F3EBDD']} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <View className="px-5 pb-3" style={{ paddingTop: insets.top + 10 }}>
        <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Feather name="chevron-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[16px] font-black text-[#171717]">Choose Chapter</Text>
            <Text className="mt-0.5 text-[10px] font-semibold text-[#80776D]">{sessionLabel}</Text>
          </View>

          <View className="h-10 w-10" />
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 120, 140) }} className="px-5">
        <Animated.View entering={FadeInDown.delay(60).duration(300)} className="overflow-hidden rounded-[24px] bg-[#151719]">
          <LinearGradient colors={period === 'morning' ? ['#202225', '#151719'] : ['#18223A', '#111827']} className="p-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[11px] font-black uppercase tracking-[0.8px] text-[#FFB56D]">Today's Assignment</Text>
                <Text className="mt-2 text-[25px] font-black text-white">{chapters.length} chapters</Text>
                <Text className="mt-1 text-[12px] font-semibold leading-5 text-[#D8D1C8]">
                  Select any chapter for your {period} session. Your progress is saved as you read.
                </Text>
              </View>

              <View className="h-[74px] w-[74px] items-center justify-center rounded-full border-[5px] border-[#FF8A18] bg-[#242628]">
                <Feather name="book-open" size={25} color="#FF7A00" />
              </View>
            </View>

            <View className="mt-5 h-2 overflow-hidden rounded-full bg-white/14">
              <View className="h-full rounded-full bg-[#FF7A00]" style={{ width: `${chapters.length ? (completedCount / chapters.length) * 100 : 0}%` }} />
            </View>
            <Text className="mt-2 text-[10px] font-bold text-[#BEB7AE]">
              {completedCount} / {chapters.length} chapters completed
            </Text>
          </LinearGradient>
        </Animated.View>

        {nextChapter ? (
          <Animated.View entering={FadeInDown.delay(100).duration(300)} className="mt-4">
            <TouchableOpacity onPress={() => openChapter(nextChapter.reference)} activeOpacity={0.88} className="flex-row items-center rounded-[20px] bg-[#FF7A00] px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Feather name="play" size={16} color="#FFFFFF" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[11px] font-bold uppercase tracking-[0.6px] text-white/80">Continue with</Text>
                <Text className="mt-0.5 text-[15px] font-black text-white">{nextChapter.reference}</Text>
              </View>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(140).duration(300)} className="mt-5">
          <Text className="mb-3 text-[15px] font-black text-[#171717]">All Chapters</Text>
          <View className="gap-3">
            {chapters.map((chapter, index) => {
              const isCompleted = completedReferences.includes(chapter.reference);

              return (
                <TouchableOpacity
                  key={chapter.id}
                  onPress={() => openChapter(chapter.reference)}
                  activeOpacity={0.86}
                  className="flex-row items-center rounded-[20px] border border-[#EFE4D7] bg-white px-4 py-4"
                >
                  <View className={`h-11 w-11 items-center justify-center rounded-full ${isCompleted ? 'bg-[#E8F7EC]' : 'bg-[#FFF2E6]'}`}>
                    <Text className={`text-[13px] font-black ${isCompleted ? 'text-[#16A34A]' : 'text-[#FF7A00]'}`}>{index + 1}</Text>
                  </View>

                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-[15px] font-black text-[#1B1B1B]">{chapter.reference}</Text>
                      {isCompleted ? <Feather name="check-circle" size={14} color="#16A34A" style={{ marginLeft: 6 }} /> : null}
                    </View>
                    <Text className="mt-1 text-[11px] font-semibold text-[#80776D]">{chapter.title}</Text>
                    <Text className="mt-1 text-[10px] font-semibold text-[#A39A90]">{chapter.estimatedMinutes} min read</Text>
                  </View>

                  <Feather name="chevron-right" size={18} color="#B0A69B" />
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BibleReadingSelectScreen;
