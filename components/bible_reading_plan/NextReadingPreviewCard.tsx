import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface NextReadingPreviewCardProps {
  reference: string;
  chapterCount: number;
  isLoading?: boolean;
  onPress: () => void;
}

const NextReadingPreviewCard = ({ reference, chapterCount, isLoading, onPress }: NextReadingPreviewCardProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.88} className="overflow-hidden rounded-[22px] bg-[#17201A]">
    <LinearGradient colors={['#1F6F36', '#174A29', '#141D16']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white/14">
              <Feather name="moon" size={15} color="#C9F4D2" />
            </View>
            <View className="ml-2 rounded-full bg-white/12 px-2.5 py-1">
              <Text className="text-[9px] font-black uppercase tracking-[0.7px] text-[#DDF8E4]">Up next</Text>
            </View>
          </View>

          <Text className="mt-4 text-[13px] font-bold text-[#C9F4D2]">Evening Reading</Text>
          <Text className="mt-1 text-[23px] font-black leading-7 text-white">{isLoading ? 'Preparing your next reading...' : reference}</Text>
          <Text className="mt-2 text-[11px] font-semibold leading-5 text-[#D7EBDD]">
            {chapterCount > 0 ? `${chapterCount} chapters waiting for your evening rhythm.` : 'Your next reading will appear when today\'s schedule loads.'}
          </Text>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <Feather name="arrow-right" size={18} color="#174A29" />
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default NextReadingPreviewCard;