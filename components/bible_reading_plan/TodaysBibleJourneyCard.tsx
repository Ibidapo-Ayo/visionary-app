import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { formatDayReadingReference, getCurrentSession } from '@/lib/helper';
import { useTodayReadingSchedule } from '@/hooks/useTodayReadingSchedule';
import { useUserReadingProgress } from '@/hooks/useUserReadingProgress';
import type { ReadingPeriod } from '@/types/index';

interface TodaysBibleJourneyCardProps {
  onOpenJourney: () => void;
  onOpenMorningReading: () => void;
}

const TodaysBibleJourneyCard = ({
  onOpenJourney,
  onOpenMorningReading,
}: TodaysBibleJourneyCardProps) => {
  const { readingSchedule, isLoadingReadingSchedule, isLoadingBibleReadingPlan, bibleReadingPlanDayNumber } = useTodayReadingSchedule();
  const { countCompleted } = useUserReadingProgress();
  const currentSession = getCurrentSession() as ReadingPeriod;
  const sessionIcon: React.ComponentProps<typeof Feather>['name'] = currentSession === 'evening' ? 'moon' : 'sun';
  const sessionLabel = currentSession === 'evening' ? 'Evening Reading' : 'Morning Reading';
  const sessionReferences = readingSchedule?.[currentSession].map(formatDayReadingReference) ?? [];
  const morningScheduleIds = readingSchedule?.morning.map((chapter) => chapter.id) ?? [];
  const eveningScheduleIds = readingSchedule?.evening.map((chapter) => chapter.id) ?? [];
  const totalChapters = morningScheduleIds.length + eveningScheduleIds.length;
  const completedChapters = countCompleted([...morningScheduleIds, ...eveningScheduleIds]);
  const progressPercent = totalChapters ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const reference = sessionReferences.length
    ? sessionReferences[0]
    : isLoadingReadingSchedule
      ? 'Loading schedule...'
      : 'No reading assigned';

  return (
    <Animated.View entering={FadeInDown.delay(160).duration(360)} className="mt-4 overflow-hidden rounded-[20px] bg-[#165928]">
    <LinearGradient colors={['#1E7737', '#145425']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Feather name={sessionIcon} size={14} color="#A8F0B9" />
          {isLoadingBibleReadingPlan ? (
            <Text className="ml-2 text-[11px] font-bold text-[#E8F9EC]">Loading...</Text>
          ) : (
            <Text className="ml-2 text-[11px] font-bold text-[#E8F9EC]">{bibleReadingPlanDayNumber !== null ? `Day ${bibleReadingPlanDayNumber} Bible Journey` : 'Bible Journey'}</Text>
          )}
          </View>
          <Text className="mt-3 text-[22px] font-black text-white">{reference}</Text>
          <Text className="mt-1 text-[11px] font-semibold text-[#C9EFD2]">{sessionLabel}</Text>
        </View>

        <TouchableOpacity onPress={onOpenJourney} activeOpacity={0.85} className="h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <Feather name="arrow-up-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="h-2 overflow-hidden rounded-full bg-white/18">
            <View className="h-full rounded-full bg-[#FFB020]" style={{ width: `${progressPercent}%` }} />
          </View>
          <Text className="mt-2 text-[10px] font-semibold text-[#D8F4DE]">{completedChapters} / {totalChapters} chapters today</Text>
        </View>

        <TouchableOpacity
          onPress={onOpenMorningReading}
          activeOpacity={0.9}
          className="h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <Feather name="arrow-right" size={18} color="#145425" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </Animated.View>
  );
};

export default TodaysBibleJourneyCard;