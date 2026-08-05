import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockBibleJourneyProgress, mockBibleJourneySessionPlan } from '@services/mockData';
import type { ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

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

  const getCompletedChaptersForToday = useBibleJourneyStore((state) => state.getCompletedChaptersForToday);
  const isReflectionCompleteForToday = useBibleJourneyStore((state) => state.isReflectionCompleteForToday);
  const getStreakStats = useBibleJourneyStore((state) => state.getStreakStats);

  const streakStats = getStreakStats();
  const morningCompletedChapters = getCompletedChaptersForToday('morning').filter((reference) =>
    mockBibleJourneySessionPlan.morning.includes(reference),
  ).length;
  const eveningCompletedChapters = getCompletedChaptersForToday('evening').filter((reference) =>
    mockBibleJourneySessionPlan.evening.includes(reference),
  ).length;

  const morningTotal = mockBibleJourneySessionPlan.morning.length;
  const eveningTotal = mockBibleJourneySessionPlan.evening.length;
  const totalTodayChapters = morningTotal + eveningTotal;
  const totalCompletedChapters = morningCompletedChapters + eveningCompletedChapters;
  const dayProgressPercent = totalTodayChapters ? Math.round((totalCompletedChapters / totalTodayChapters) * 100) : 0;
  const yearlyProgressPercent = Math.round((mockBibleJourneyProgress.completedReadings / mockBibleJourneyProgress.totalReadings) * 100);

  const morningReadingDone = morningCompletedChapters >= morningTotal;
  const morningReflectionDone = isReflectionCompleteForToday('morning');
  const eveningUnlocked = morningReadingDone && morningReflectionDone;
  const eveningReadingDone = eveningCompletedChapters >= eveningTotal;
  const eveningReflectionDone = isReflectionCompleteForToday('evening');

  const openReading = (period: ReadingPeriod) => {
    router.push({
      pathname: '/(app)/bible-reading-select',
      params: { period },
    });
  };

  const openReflectionIntro = (period: ReadingPeriod) => {
    router.push({
      pathname: '/(app)/bible-reflection-intro',
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
            <Text className="text-[16px] font-black text-[#171717]">Bible Journey</Text>
            <Text className="mt-0.5 text-[10px] font-semibold text-[#81776D]">Daily rhythm</Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/(app)/home')} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Feather name="home" size={17} color="#181818" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(70).duration(320)} className="mt-5 overflow-hidden rounded-[24px] bg-[#17191B]">
          <LinearGradient colors={['#202225', '#151719']} className="p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center">
                  <FontAwesome5 name="fire" size={13} color="#FF7A00" solid />
                  <Text className="ml-2 text-[11px] font-black uppercase tracking-[0.7px] text-[#FFB56D]">Today&apos;s Journey</Text>
                </View>
                <Text className="mt-3 text-[32px] font-black leading-[36px] text-white">{dayProgressPercent}%</Text>
                <Text className="mt-1 text-[12px] font-semibold leading-5 text-[#CFC8BE]">
                  {totalCompletedChapters} of {totalTodayChapters} chapters completed today.
                </Text>
              </View>

              <View className="h-[88px] w-[88px] items-center justify-center rounded-full border-[6px] border-[#FF8A18] bg-[#242628]">
                <Text className="text-[20px] font-black text-white">{streakStats.currentStreak}</Text>
                <Text className="text-[9px] font-bold text-[#D8D1C8]">days</Text>
              </View>
            </View>

            <View className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
              <View className="h-full rounded-full bg-[#FF7A00]" style={{ width: `${dayProgressPercent}%` }} />
            </View>
          </LinearGradient>
        </Animated.View>

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
              subtitle={mockBibleJourneySessionPlan.morning.join(' / ')}
              meta={`${morningCompletedChapters}/${morningTotal} chapters complete`}
              icon="sunrise"
              accent="#FF7A00"
              complete={morningReadingDone}
              buttonLabel={morningReadingDone ? 'Review Morning Chapters' : 'Select Morning Chapter'}
              onPress={() => openReading('morning')}
            />

            <JourneyStep
              title="Morning Reflection"
              subtitle="Pause, process, and capture what stood out from the morning reading."
              meta={morningReadingDone ? 'Unlocked after reading' : 'Finish morning chapters first'}
              icon="edit-3"
              accent="#16A34A"
              complete={morningReflectionDone}
              locked={!morningReadingDone}
              buttonLabel={morningReflectionDone ? 'Open Reflection' : 'Reflect on Morning Reading'}
              onPress={() => openReflectionIntro('morning')}
            />

            <JourneyStep
              title="Evening Reading"
              subtitle={mockBibleJourneySessionPlan.evening.join(' / ')}
              meta={eveningUnlocked ? `${eveningCompletedChapters}/${eveningTotal} chapters complete` : 'Unlocks after morning reflection'}
              icon="moon"
              accent="#3768D8"
              complete={eveningReadingDone}
              locked={!eveningUnlocked}
              buttonLabel={eveningReadingDone ? 'Review Evening Chapters' : 'Select Evening Chapter'}
              onPress={() => openReading('evening')}
            />

            <JourneyStep
              title="Evening Reflection"
              subtitle="Close the day by writing what God highlighted through the evening chapters."
              meta={eveningReadingDone ? 'Ready for reflection' : 'Finish evening chapters first'}
              icon="heart"
              accent="#16A34A"
              complete={eveningReflectionDone}
              locked={!eveningReadingDone}
              buttonLabel={eveningReflectionDone ? 'Open Reflection' : 'Reflect on Evening Reading'}
              onPress={() => openReflectionIntro('evening')}
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
                Complete the reading first, then reflection. The evening session opens after your morning reflection is done.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BibleJourneyScreen;
