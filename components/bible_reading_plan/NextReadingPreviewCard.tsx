import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface NextReadingPreviewCardProps {
  reference: string;
  chapterCount: number;
  isLoading?: boolean;
  locked?: boolean;
  onPress: () => void;
}

const NextReadingPreviewCard = ({ reference, chapterCount, isLoading, locked, onPress }: NextReadingPreviewCardProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.88} className="overflow-hidden rounded-[22px] bg-[#17201A]">
    <LinearGradient
      colors={locked ? ['#2B2B2B', '#1C1C1C', '#141414'] : ['#1F6F36', '#174A29', '#141D16']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-4"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white/14">
              <Feather name={locked ? 'lock' : 'moon'} size={15} color={locked ? '#FFD9A0' : '#C9F4D2'} />
            </View>
            <View className="ml-2 rounded-full bg-white/12 px-2.5 py-1">
              <Text className="text-[9px] font-black uppercase tracking-[0.7px] text-[#DDF8E4]">
                {locked ? 'Locked' : 'Up next'}
              </Text>
            </View>
          </View>

          <Text className="mt-4 text-[13px] font-bold text-[#C9F4D2]">Evening Reading</Text>
          <Text className="mt-1 text-[23px] font-black leading-7 text-white">
            {locked ? 'Finish morning reading to unlock' : isLoading ? 'Preparing your next reading...' : reference}
          </Text>
          <Text className="mt-2 text-[11px] font-semibold leading-5 text-[#D7EBDD]">
            {locked
              ? 'Complete every morning chapter first, then evening opens automatically.'
              : chapterCount > 0
                ? `${chapterCount} ${chapterCount === 1 ? 'chapter' : 'chapters'} waiting for your evening rhythm.`
                : 'Your next reading will appear when today\'s schedule loads.'}
          </Text>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <Feather name={locked ? 'lock' : 'arrow-right'} size={18} color="#174A29" />
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default NextReadingPreviewCard;