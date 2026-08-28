import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface TomorrowMorningLockedPreviewCardProps {
  reference: string;
  chapterCount: number;
  dayNumber: number | null;
  message: string;
  isLoading?: boolean;
}

const TomorrowMorningLockedPreviewCard = ({
  reference,
  chapterCount,
  dayNumber,
  message,
  isLoading,
}: TomorrowMorningLockedPreviewCardProps) => (
  <View className="overflow-hidden rounded-[22px] bg-[#151719]">
    <LinearGradient colors={['#1A2B1E', '#121614', '#0E100F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white/14">
              <Feather name="lock" size={15} color="#FFD9A0" />
            </View>
            <View className="ml-2 rounded-full bg-white/12 px-2.5 py-1">
              <Text className="text-[9px] font-black uppercase tracking-[0.7px] text-[#DDF8E4]">Up next</Text>
            </View>
          </View>

          <Text className="mt-4 text-[13px] font-bold text-[#C9F4D2]">
            {dayNumber ? `Day ${dayNumber} Morning Reading` : 'Tomorrow Morning Reading'}
          </Text>
          <Text className="mt-1 text-[23px] font-black leading-7 text-white">
            {isLoading ? 'Preparing tomorrow morning...' : reference}
          </Text>
          <Text className="mt-2 text-[11px] font-semibold leading-5 text-[#D7EBDD]">{message}</Text>
          <Text className="mt-2 text-[10px] font-bold uppercase tracking-[0.4px] text-[#FFD9A0]">
            {chapterCount > 0
              ? `${chapterCount} ${chapterCount === 1 ? 'chapter' : 'chapters'} locked until tomorrow.`
              : 'Tomorrow\'s chapter will appear when the schedule is ready.'}
          </Text>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full bg-white/20">
          <Feather name="sunrise" size={18} color="#FFD9A0" />
        </View>
      </View>
    </LinearGradient>
  </View>
);

export default TomorrowMorningLockedPreviewCard;