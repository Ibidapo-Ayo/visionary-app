import React, { useCallback, useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@store/authStore';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';
import { formatDayReadingReference, getCurrentSession, getInitials } from '@/lib/helper';
import { useUserReadingProgressStore } from '@/store/userReadingProgressStore';
import TodaysBibleJourneyCard from '@/components/bible_reading_plan/TodaysBibleJourneyCard';
import NextReadingPreviewCard from '@/components/bible_reading_plan/NextReadingPreviewCard';
import { useBibleReadingPlanStore } from '@/store/bible-reading-plan';
import { useReadingScheduleStore } from '@/store/readingScheduleStore';
import { useUserReadingProgress } from '@/hooks/useUserReadingProgress';
import { useReadingPeriodLock } from '@/hooks/useReadingPeriodLock';
import { useStreak } from '@/hooks/useStreak';
import { MAX_CONTENT_WIDTH, moderateScale, scaleFont, useResponsive } from '@/lib/responsive';


const StatPill = ({ icon, label, value, tint }: { icon: React.ComponentProps<typeof Feather>['name']; label: string; value: string; tint: string }) => (
  <View className="flex-1 items-center rounded-[18px] border border-[#ECE6DD] bg-white px-2 py-3">
    <View
      style={{ height: moderateScale(32), width: moderateScale(32), backgroundColor: `${tint}18` }}
      className="items-center justify-center rounded-full"
    >
      <Feather name={icon} size={15} color={tint} />
    </View>
    <Text className="mt-2 text-[18px] font-black text-[#1B1B1B]" style={{ fontSize: scaleFont(18) }}>
      {value}
    </Text>
    <Text className="mt-0.5 text-center text-[10px] font-semibold text-[#7A746C]">{label}</Text>
  </View>
);

type ProgressRangeKey = 'week' | 'lastWeek' | 'month' | 'year';

const progressRangeOptions: { key: ProgressRangeKey; label: string }[] = [
  { key: 'week', label: 'This Week' },
  { key: 'lastWeek', label: 'Last Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
];

const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, isTablet } = useResponsive();
  const user = useAuthStore((state) => state.user);
  const getReflectionsStatsForRange = useBibleJourneyStore((state) => state.getProgressStatsForRange);
  const getDbProgressStatsForRange = useUserReadingProgressStore((state) => state.getProgressStatsForRange);
  const { refreshProgress } = useUserReadingProgress();
  const { eveningUnlocked, nextActionablePeriod } = useReadingPeriodLock();
  const { currentStreak, refreshStreak } = useStreak();
  const bibleReadingPlan = useBibleReadingPlanStore((state) => state.bibleReadingPlan);
  const bibleReadingPlanDayNumber = useBibleReadingPlanStore((state) => state.bibleReadingPlanDayNumber);
  const loadBibleReadingPlan = useBibleReadingPlanStore((state) => state.loadBibleReadingPlan);
  const readingSchedule = useReadingScheduleStore((state) => state.readingSchedule);
  const isLoadingReadingSchedule = useReadingScheduleStore((state) => state.isLoadingReadingSchedule);
  const loadReadingSchedule = useReadingScheduleStore((state) => state.loadReadingSchedule);
  const queryClient = useQueryClient();
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [selectedProgressRange, setSelectedProgressRange] = useState<ProgressRangeKey>('week');
  const [isProgressRangeOpen, setIsProgressRangeOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedProgressLabel = progressRangeOptions.find((option) => option.key === selectedProgressRange)?.label ?? 'This Week';
  const dbProgressStats = getDbProgressStatsForRange(selectedProgressRange, bibleReadingPlan?.group_plan_start_date);
  const { reflections: reflectionsCount } = getReflectionsStatsForRange(selectedProgressRange);
  const progressStats = { ...dbProgressStats, reflections: reflectionsCount };
  const nextEveningReading = readingSchedule?.evening[0] ?? null;
  const nextEveningReference = nextEveningReading ? formatDayReadingReference(nextEveningReading) : 'Evening reading';
  const eveningChapterCount = readingSchedule?.evening.length ?? 0;

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Visionary Member';
  const firstName = fullName.split(' ')[0] || 'Visionary';
  const userInitials = getInitials(user?.firstName, user?.lastName, user?.email);
  const profileImage = user?.profileImage?.trim() ?? '';
  const shouldShowProfileImage = !!profileImage && !avatarLoadFailed;
  // Center content within a readable max width on tablets instead of stretching edge-to-edge.
  const horizontalPadding = isTablet ? Math.max((width - MAX_CONTENT_WIDTH) / 2, 20) : 10;

  useEffect(() => {
    if (!bibleReadingPlan || bibleReadingPlanDayNumber === null) {
      return;
    }

    void loadReadingSchedule(bibleReadingPlan.id, bibleReadingPlanDayNumber).catch((error) => {
      console.warn('Unable to load reading schedule:', error);
    });
  }, [bibleReadingPlan, bibleReadingPlanDayNumber, loadReadingSchedule]);

  const refreshReadingPlanAndSchedule = useCallback(async () => {
    await loadBibleReadingPlan();

    const { bibleReadingPlan: refreshedPlan, bibleReadingPlanDayNumber: refreshedDayNumber } =
      useBibleReadingPlanStore.getState();

    if (!refreshedPlan || refreshedDayNumber === null) {
      return;
    }

    await loadReadingSchedule(refreshedPlan.id, refreshedDayNumber, { force: true });
  }, [loadBibleReadingPlan, loadReadingSchedule]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const tasks: Promise<unknown>[] = [
        refreshProgress(),
        refreshStreak(),
        refreshReadingPlanAndSchedule(),
        // Bible chapter text is cached indefinitely (staleTime: Infinity); force it to refetch.
        queryClient.invalidateQueries({ queryKey: ['bible-chapter'] }),
      ];

      await Promise.all(tasks);
    } catch (error) {
      console.warn('Unable to refresh home data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refreshProgress, refreshReadingPlanAndSchedule, refreshStreak]);

  return (
    <LinearGradient colors={['#FFFDF9', '#F8F3EB', '#F4EFE6']} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: Math.max(insets.bottom + 118, 136),
          paddingHorizontal: horizontalPadding,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#FF7A00"
            colors={['#FF7A00']}
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        <Animated.View entering={FadeIn.duration(240)} className="flex-row items-center justify-between">
          <View>
            <Text className="text-[19px] font-bold leading-6 text-[#161616]">Good {getCurrentSession()},</Text>
            <Text className="text-[24px] font-black leading-8 text-[#FF7A00]">{firstName}</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/(app)/digest')}
              activeOpacity={0.85}
              style={{ height: moderateScale(40), width: moderateScale(40) }}
              className="relative items-center justify-center rounded-full bg-white"
            >
              <Feather name="bell" size={17} color="#252525" />
              <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FF7A00]" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(app)/profile')}
              activeOpacity={0.9}
              style={{ height: moderateScale(44), width: moderateScale(44) }}
              className="overflow-hidden rounded-full bg-[#171717]"
            >
              {shouldShowProfileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  onError={() => setAvatarLoadFailed(true)}
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Text className="text-[15px] font-black text-[#FF7A00]">{userInitials}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(110).duration(360)} className="mt-5 overflow-hidden rounded-[20px] bg-[#17191B]">
          <LinearGradient colors={['#202225', '#151719']}>
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center">
                  <View className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
                  <Text className="ml-2 text-[11px] font-bold text-white">Current Streak</Text>
                </View>
                <View className="mt-4 flex-row items-end">
                  <Text className="font-black leading-[44px] text-white" style={{ fontSize: scaleFont(42) }}>
                    {currentStreak}
                  </Text>
                  <Text className="mb-1.5 ml-2 text-[16px] font-bold text-[#E6E0D8]">days</Text>
                </View>
                <Text className="mt-2 text-[11px] font-semibold text-[#BEB7AE]">Keep the flame steady.</Text>
              </View>

              <View
                style={{ height: moderateScale(92), width: moderateScale(92), borderWidth: moderateScale(6) }}
                className="items-center justify-center rounded-full border-[#FF8A18] bg-[#242628]"
              >
                <View
                  style={{ height: moderateScale(66), width: moderateScale(66) }}
                  className="items-center justify-center rounded-full bg-[#151719]"
                >
                  <FontAwesome5 name="fire" size={30} color="#FF7A00" solid />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <TodaysBibleJourneyCard
          onOpenJourney={() => router.push('/(app)/bible-journey')}
          onOpenReading={(readingPeriod) =>
            router.push({
              pathname: '/(app)/bible-reading-select',
              params: { period: readingPeriod },
            })
          }
        />

        <Animated.View entering={FadeInDown.delay(210).duration(360)} className="mt-5">
          <View className="flex-row items-center justify-between" style={{ zIndex: 30, elevation: 30 }}>
            <Text className="text-[15px] font-black text-[#181818]">Your Progress</Text>
            <View className="items-end">
              <TouchableOpacity
                onPress={() => setIsProgressRangeOpen((isOpen) => !isOpen)}
                activeOpacity={0.8}
                className="h-9 flex-row items-center rounded-full border border-[#E8DED2] bg-white px-3"
              >
                <Text className="text-[11px] font-bold text-[#716A61]">{selectedProgressLabel}</Text>
                <Feather name={isProgressRangeOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#716A61" />
              </TouchableOpacity>

              {isProgressRangeOpen ? (
                <View className="absolute right-0 top-11 w-[142px] overflow-hidden rounded-[16px] border border-[#E8DED2] bg-white" style={{ elevation: 8 }}>
                  {progressRangeOptions.map((option) => {
                    const isSelected = option.key === selectedProgressRange;

                    return (
                      <TouchableOpacity
                        key={option.key}
                        onPress={() => {
                          setSelectedProgressRange(option.key);
                          setIsProgressRangeOpen(false);
                        }}
                        activeOpacity={0.82}
                        className={`flex-row items-center justify-between px-3 py-3 ${isSelected ? 'bg-[#FFF3E7]' : 'bg-white'}`}
                      >
                        <Text className={`text-[11px] font-bold ${isSelected ? 'text-[#FF7A00]' : 'text-[#554E47]'}`}>{option.label}</Text>
                        {isSelected ? <Feather name="check" size={13} color="#FF7A00" /> : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>

          <View className="mt-3 flex-row gap-3" style={{ zIndex: 1 }}>
            <StatPill icon="book-open" label="Days Read" value={`${progressStats.daysRead}`} tint="#16A34A" />
            <StatPill icon="award" label="Chapters" value={`${progressStats.chapters}`} tint="#FF7A00" />
            <StatPill icon="message-circle" label="Reflections" value={`${progressStats.reflections}`} tint="#7257D6" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).duration(360)} className="mt-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] font-black text-[#181818]">Continue Your Journey</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/bible-journey')} activeOpacity={0.8}>
              <Text className="text-[11px] font-bold text-[#716A61]">View all</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-3">
            <NextReadingPreviewCard
              reference={nextEveningReference}
              chapterCount={eveningChapterCount}
              isLoading={isLoadingReadingSchedule}
              locked={!eveningUnlocked}
              onPress={() =>
                router.push({
                  pathname: '/(app)/bible-reading-select',
                  params: { period: eveningUnlocked ? 'evening' : (nextActionablePeriod ?? 'morning') },
                })
              }
            />
          </View>
        </Animated.View>

      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
