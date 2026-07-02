import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import BibleJourneyProgressCard from '@components/BibleJourneyProgressCard';
import BibleJourneyStreakCard from '@components/BibleJourneyStreakCard';
import { mockBibleJourneyProgress, mockBibleJourneySessionPlan } from '@services/mockData';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

const BibleJourneyScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  const getCompletedChaptersForToday = useBibleJourneyStore((state) => state.getCompletedChaptersForToday);
  const isReflectionCompleteForToday = useBibleJourneyStore((state) => state.isReflectionCompleteForToday);
  const getTodayProgress = useBibleJourneyStore((state) => state.getTodayProgress);
  const getStreakStats = useBibleJourneyStore((state) => state.getStreakStats);

  const todayProgress = getTodayProgress();
  const streakStats = getStreakStats();

  const adjustedCompletedReadings = Math.min(
    mockBibleJourneyProgress.totalReadings,
    mockBibleJourneyProgress.completedReadings + streakStats.totalCompletedDays,
  );

  const morningCompletedChapters = getCompletedChaptersForToday('morning').filter((reference) =>
    mockBibleJourneySessionPlan.morning.includes(reference),
  ).length;
  const eveningCompletedChapters = getCompletedChaptersForToday('evening').filter((reference) =>
    mockBibleJourneySessionPlan.evening.includes(reference),
  ).length;

  const morningReadingDone = morningCompletedChapters >= mockBibleJourneySessionPlan.morning.length;
  const morningReflectionDone = isReflectionCompleteForToday('morning');
  const eveningUnlocked = morningReadingDone && morningReflectionDone;

  const eveningReadingDone = eveningCompletedChapters >= mockBibleJourneySessionPlan.evening.length;
  const eveningReflectionDone = isReflectionCompleteForToday('evening');

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/home');
  };

  const openReading = (period: 'morning' | 'evening') => {
    const plan = period === 'morning' ? mockBibleJourneySessionPlan.morning : mockBibleJourneySessionPlan.evening;
    const completed = getCompletedChaptersForToday(period);
    const nextReference = plan.find((reference) => !completed.includes(reference)) ?? plan[0];

    router.push({
      pathname: '/(app)/bible-reading',
      params: {
        period,
        reference: nextReference,
      },
    });
  };

  const openReflectionIntro = (period: 'morning' | 'evening') => {
    router.push({
      pathname: '/(app)/bible-reflection-intro',
      params: { period },
    });
  };

  const gradient = isDark
    ? (['#040404', '#090909', '#101010'] as const)
    : (['#F8F4EE', '#F5EFE7', '#F0EADF'] as const);

  const cardStyle = {
    borderColor: isDark ? '#2E2E2E' : '#E2D5C5',
    backgroundColor: isDark ? '#141414' : '#FFF8EF',
  };

  const subtleTextColor = isDark ? '#A7A7A7' : '#7E6B59';
  const titleColor = isDark ? '#F4F4F4' : '#2E251D';

  return (
    <LinearGradient colors={gradient} className="flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View className="px-5 pb-3 pt-8">
        <Animated.View entering={FadeIn.duration(240)} className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor: isDark ? '#2D2D2D' : '#DECDBB',
              backgroundColor: isDark ? '#151515' : '#FFF4E7',
            }}
            onPress={handleBackPress}
          >
            <Feather name="chevron-left" size={18} color={isDark ? '#F4F4F4' : '#403124'} />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[17px] font-semibold" style={{ color: titleColor }}>Bible Journey</Text>
            <Text className="text-[11px]" style={{ color: subtleTextColor }}>One clear step at a time</Text>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: 'transparent' }} />
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} className="px-5">
        <Animated.View entering={SlideInUp.duration(260)}>
          <Card animated={false} padding="md" blurVariant="none" style={cardStyle}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1px]" style={{ color: subtleTextColor }}>Today&apos;s Path</Text>
            <Text className="mt-2 text-[14px] leading-6" style={{ color: titleColor }}>
              Morning Reading → Bible Reflection → Evening Reading → Bible Reflection
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(30).duration(260)} className="mt-4">
          <BibleJourneyProgressCard
            year={mockBibleJourneyProgress.year}
            cyclesCompleted={mockBibleJourneyProgress.cyclesCompleted}
            cyclesTarget={mockBibleJourneyProgress.cyclesTarget}
            completedReadings={adjustedCompletedReadings}
            totalReadings={mockBibleJourneyProgress.totalReadings}
          />
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(60).duration(260)} className="mt-4">
          <BibleJourneyStreakCard
            morningCompleted={todayProgress.morningCompleted}
            eveningCompleted={todayProgress.eveningCompleted}
            dailyCompleted={todayProgress.dailyCompleted}
            currentStreak={streakStats.currentStreak}
            longestStreak={streakStats.longestStreak}
          />
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(90).duration(260)} className="mt-4">
          <Card animated={false} padding="md" blurVariant="none" style={cardStyle}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#FFB56D]">Morning Reading</Text>
            <Text className="mt-1 text-[12px]" style={{ color: subtleTextColor }}>
              {mockBibleJourneySessionPlan.morning.join(' • ')}
            </Text>
            <Text className="mt-2 text-[12px]" style={{ color: titleColor }}>
              {morningCompletedChapters}/{mockBibleJourneySessionPlan.morning.length} chapters completed
            </Text>

            <TouchableOpacity
              className={`mt-4 rounded-full px-4 py-2.5 ${morningReadingDone ? 'bg-[#1B3521]' : 'bg-[#FF7A00]'}`}
              onPress={() => openReading('morning')}
            >
              <Text className={`text-center text-[12px] font-semibold ${morningReadingDone ? 'text-[#DDF3E3]' : 'text-[#1B1309]'}`}>
                {morningReadingDone ? 'Review Morning Reading' : 'Continue Morning Reading'}
              </Text>
            </TouchableOpacity>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120).duration(260)} className="mt-4">
          <Card animated={false} padding="md" blurVariant="none" style={cardStyle}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#91DDA7]">Morning Bible Reflection</Text>
            <Text className="mt-1 text-[12px]" style={{ color: subtleTextColor }}>
              Unlocks when every morning chapter is completed.
            </Text>

            <TouchableOpacity
              className={`mt-4 rounded-full px-4 py-2.5 ${morningReadingDone ? 'bg-[#16A34A]' : 'bg-[#2D2D2D]'}`}
              disabled={!morningReadingDone}
              onPress={() => openReflectionIntro('morning')}
            >
              <Text className={`text-center text-[12px] font-semibold ${morningReadingDone ? 'text-[#102311]' : 'text-[#A8A8A8]'}`}>
                {morningReflectionDone ? 'Morning Reflection Completed' : 'Reflect On Morning Reading'}
              </Text>
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {!eveningUnlocked ? (
          <Animated.View
            key="evening-locked"
            entering={SlideInUp.delay(150).duration(280)}
            exiting={FadeOut.duration(200)}
            className="mt-4"
          >
            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                borderColor: '#3B342D',
                backgroundColor: isDark ? '#191511' : '#FDF1E4',
              }}
            >
              <View className="flex-row items-start gap-3">
                <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-[#2A2017]">
                  <Feather name="lock" size={14} color="#FFB56D" />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] font-semibold" style={{ color: isDark ? '#F2D9BF' : '#8A5A2C' }}>Evening Reading Locked</Text>
                  <Text className="mt-1 text-[12px] leading-5" style={{ color: isDark ? '#D9C0A8' : '#9A6A3A' }}>
                    Complete your Morning Reading and Reflection to unlock the Evening Reading.
                  </Text>
                  <Text className="mt-2 text-[11px]" style={{ color: isDark ? '#CFAF90' : '#9C744F' }}>
                    Progress: Reading {morningCompletedChapters}/{mockBibleJourneySessionPlan.morning.length} • Reflection {morningReflectionDone ? 'Done' : 'Pending'}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        ) : (
          <Animated.View
            key="evening-unlocked"
            entering={SlideInUp.delay(150).duration(320)}
            exiting={FadeOut.duration(200)}
            className="mt-4"
          >
            <Card animated={false} padding="md" blurVariant="none" style={cardStyle}>
              <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#8FA4FF]">Evening Reading</Text>
              <Text className="mt-1 text-[12px]" style={{ color: subtleTextColor }}>
                {mockBibleJourneySessionPlan.evening.join(' • ')}
              </Text>
              <Text className="mt-2 text-[12px]" style={{ color: titleColor }}>
                {eveningCompletedChapters}/{mockBibleJourneySessionPlan.evening.length} chapters completed
              </Text>

              <TouchableOpacity
                className={`mt-4 rounded-full px-4 py-2.5 ${eveningReadingDone ? 'bg-[#1B3521]' : 'bg-[#FF7A00]'}`}
                onPress={() => openReading('evening')}
              >
                <Text className={`text-center text-[12px] font-semibold ${eveningReadingDone ? 'text-[#DDF3E3]' : 'text-[#1B1309]'}`}>
                  {eveningReadingDone ? 'Review Evening Reading' : 'Continue Evening Reading'}
                </Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        <Animated.View entering={SlideInUp.delay(180).duration(260)} className="mt-4">
          <Card animated={false} padding="md" blurVariant="none" style={cardStyle}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#91DDA7]">Evening Bible Reflection</Text>
            <Text className="mt-1 text-[12px]" style={{ color: subtleTextColor }}>
              Available after all evening chapters are completed.
            </Text>

            <TouchableOpacity
              className={`mt-4 rounded-full px-4 py-2.5 ${eveningReadingDone ? 'bg-[#16A34A]' : 'bg-[#2D2D2D]'}`}
              disabled={!eveningReadingDone}
              onPress={() => openReflectionIntro('evening')}
            >
              <Text className={`text-center text-[12px] font-semibold ${eveningReadingDone ? 'text-[#102311]' : 'text-[#A8A8A8]'}`}>
                {eveningReflectionDone ? 'Evening Reflection Completed' : 'Reflect On Evening Reading'}
              </Text>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BibleJourneyScreen;
