import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface TodayJourneyProgressCardProps {
  progressPercent: number;
  completedChapters: number;
  totalChapters: number;
  currentStreak: number;
}

const TodayJourneyProgressCard = ({
  progressPercent,
  completedChapters,
  totalChapters,
  currentStreak,
}: TodayJourneyProgressCardProps) => (
  <Animated.View entering={FadeInDown.delay(70).duration(320)} className="mt-5 overflow-hidden rounded-[24px] bg-[#17191B]">
    <LinearGradient colors={['#202225', '#151719']} className="p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            <FontAwesome5 name="fire" size={13} color="#FF7A00" solid />
            <Text className="ml-2 text-[11px] font-black uppercase tracking-[0.7px] text-[#FFB56D]">Today&apos;s Journey</Text>
          </View>
          <Text className="mt-3 text-[32px] font-black leading-[36px] text-white">{progressPercent}%</Text>
          <Text className="mt-1 text-[12px] font-semibold leading-5 text-[#CFC8BE]">
            {completedChapters} of {totalChapters} chapters completed today.
          </Text>
        </View>

        <View className="h-[88px] w-[88px] items-center justify-center rounded-full border-[6px] border-[#FF8A18] bg-[#242628]">
          <Text className="text-[20px] font-black text-white">{currentStreak}</Text>
          <Text className="text-[9px] font-bold text-[#D8D1C8]">days</Text>
        </View>
      </View>

      <View className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
        <View className="h-full rounded-full bg-[#FF7A00]" style={{ width: `${progressPercent}%` }} />
      </View>
    </LinearGradient>
  </Animated.View>
);

export default TodayJourneyProgressCard;