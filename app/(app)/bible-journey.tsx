import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';
import { calculateReadingProgressPercent } from '@/store/userReadingProgressStore';
import { formatDayReadingReference, getReadingSubtitle } from '@/lib/helper';
import { useTodayReadingSchedule } from '@/hooks/useTodayReadingSchedule';
import { useUserReadingProgress } from '@/hooks/useUserReadingProgress';
import TodayJourneyProgressCard from '@/components/bible_reading_plan/TodayJourneyProgressCard';

type JourneyStepProps = {
  title: string;
  subtitle: string;
  meta: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  accent: string;
  complete: boolean;
  locked?: boolean;
  buttonLabel: string;
  onPress: () => void;
};

const MiniStat = ({ icon, value, label, tint }: { icon: React.ComponentProps<typeof Feather>['name']; value: string; label: string; tint: string }) => (
  <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
    <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${tint}18` }}>
      <Feather name={icon} size={15} color={tint} />
    </View>
    <Text className="mt-2 text-[17px] font-black text-[#171717]">{value}</Text>
    <Text className="mt-0.5 text-[9px] font-bold text-[#81776D]">{label}</Text>
  </View>
);

const JourneyStep = ({ title, subtitle, meta, icon, accent, complete, locked, buttonLabel, onPress }: JourneyStepProps) => (
  <View className={`rounded-[22px] border px-4 py-4 ${locked ? 'border-[#E9DAC8] bg-[#F7EBDD]' : 'border-[#EFE5D8] bg-white'}`}>
    <View className="flex-row items-start">
      <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: locked ? '#EFE0CE' : `${accent}18` }}>
        <Feather name={locked ? 'lock' : icon} size={18} color={locked ? '#9B7650' : accent} />
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-[15px] font-black text-[#171717]">{title}</Text>
          {complete ? <Feather name="check-circle" size={17} color="#16A34A" /> : null}
        </View>
        <Text className="mt-1 text-[11px] font-semibold leading-5 text-[#7D7368]">{subtitle}</Text>
        <Text className="mt-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#A0988E]">{meta}</Text>
      </View>
    </View>

    <TouchableOpacity
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.88}
      className={`mt-4 h-11 flex-row items-center justify-center rounded-[15px] ${locked ? 'bg-[#D8C7B5]' : complete ? 'bg-[#14351E]' : 'bg-[#FF7A00]'}`}
    >
      <Text className={`text-[12px] font-black ${locked ? 'text-[#806349]' : 'text-white'}`}>{buttonLabel}</Text>
      {!locked ? <Feather name="arrow-right" size={15} color="#FFFFFF" style={{ marginLeft: 8 }} /> : null}
    </TouchableOpacity>
  </View>
);

const BibleJourneyScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getStreakStats = useBibleJourneyStore((state) => state.getStreakStats);
  const { bibleReadingPlan, bibleReadingPlanDayNumber, readingSchedule, isLoadingReadingSchedule } = useTodayReadingSchedule();
  const { countCompleted } = useUserReadingProgress();

  const streakStats = getStreakStats();
  const morningReferences = readingSchedule?.morning.map(formatDayReadingReference) ?? [];
  const eveningReferences = readingSchedule?.evening.map(formatDayReadingReference) ?? [];
  const morningScheduleIds = readingSchedule?.morning.map((reading) => reading.id) ?? [];
  const eveningScheduleIds = readingSchedule?.evening.map((reading) => reading.id) ?? [];
  const morningCompletedChapters = countCompleted(morningScheduleIds);
  const eveningCompletedChapters = countCompleted(eveningScheduleIds);

  const morningTotal = morningReferences.length;
  const eveningTotal = eveningReferences.length;
  const totalTodayChapters = morningTotal + eveningTotal;
  const totalCompletedChapters = countCompleted([...morningScheduleIds, ...eveningScheduleIds]);
  const dayProgressPercent = calculateReadingProgressPercent(totalTodayChapters, totalCompletedChapters);
  const yearlyProgressPercent = bibleReadingPlan && bibleReadingPlanDayNumber !== null
    ? Math.min(100, Math.round((bibleReadingPlanDayNumber / bibleReadingPlan.total_days) * 100))
    : 0;
  const morningSubtitle = getReadingSubtitle(morningReferences, 'morning', isLoadingReadingSchedule);
  const eveningSubtitle = getReadingSubtitle(eveningReferences, 'evening', isLoadingReadingSchedule);

  const morningReadingDone = morningTotal > 0 && morningCompletedChapters >= morningTotal;
  const eveningUnlocked = morningReadingDone;
  const eveningReadingDone = eveningTotal > 0 && eveningCompletedChapters >= eveningTotal;

  const openReading = (period: ReadingPeriod) => {
    router.push({
      pathname: '/(app)/bible-reading-select',
      params: { period },
    });
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/home');
  };

  return (
    <LinearGradient colors={['#FFFDF9', '#F8F3EB', '#F4EFE6']} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom + 116, 136) }}
        className="px-5"
      >
        <Animated.View entering={FadeIn.duration(240)} className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Feather name="chevron-left" size={20} color="#181818" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[16px] font-black text-[#171717]">{bibleReadingPlanDayNumber !== null ? `Day ${bibleReadingPlanDayNumber} Bible Journey` : 'Bible Journey'}</Text>
            <Text className="mt-0.5 text-[10px] font-semibold text-[#81776D]">Daily rhythm</Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/(app)/home')} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Feather name="home" size={17} color="#181818" />
          </TouchableOpacity>
        </Animated.View>

        <TodayJourneyProgressCard
          progressPercent={dayProgressPercent}
          completedChapters={totalCompletedChapters}
          totalChapters={totalTodayChapters}
          currentStreak={streakStats.currentStreak}
        />

        <Animated.View entering={FadeInDown.delay(120).duration(320)} className="mt-4 flex-row gap-3">
          <MiniStat icon="book-open" value={`${yearlyProgressPercent}%`} label="Year Goal" tint="#16A34A" />
          <MiniStat icon="calendar" value={`${totalTodayChapters}`} label="Chapters Today" tint="#FF7A00" />
          <MiniStat icon="award" value={`${streakStats.longestStreak}`} label="Best Streak" tint="#3768D8" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(170).duration(320)} className="mt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[15px] font-black text-[#171717]">Today&apos;s Flow</Text>
            <Text className="text-[10px] font-bold text-[#81776D]">Morning to evening</Text>
          </View>

          <View className="gap-3">
            <JourneyStep
              title="Morning Reading"
              subtitle={morningSubtitle}
              meta={`${morningCompletedChapters}/${morningTotal} chapters complete`}
              icon="sunrise"
              accent="#FF7A00"
              complete={morningReadingDone}
              buttonLabel={morningReadingDone ? 'Review Morning Chapters' : 'Select Morning Chapter'}
              onPress={() => openReading('morning')}
            />

            <JourneyStep
              title="Evening Reading"
              subtitle={eveningSubtitle}
              meta={eveningUnlocked ? `${eveningCompletedChapters}/${eveningTotal} chapters complete` : 'Unlocks after morning reading'}
              icon="moon"
              accent="#3768D8"
              complete={eveningReadingDone}
              locked={!eveningUnlocked}
              buttonLabel={eveningReadingDone ? 'Review Evening Chapters' : 'Select Evening Chapter'}
              onPress={() => openReading('evening')}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(320)} className="mt-5 rounded-[22px] border border-[#E6D9C9] bg-white p-4">
          <View className="flex-row items-start">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E6]">
              <Feather name="compass" size={17} color="#FF7A00" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-black text-[#171717]">Stay steady today</Text>
              <Text className="mt-1 text-[11px] font-semibold leading-5 text-[#7D7368]">
                Complete the morning reading first. The evening session opens right after.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BibleJourneyScreen;
