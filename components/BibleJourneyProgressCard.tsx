import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';

interface BibleJourneyProgressCardProps {
  year: number;
  cyclesCompleted: number;
  cyclesTarget: number;
  completedReadings: number;
  totalReadings: number;
}

const BibleJourneyProgressCard = ({
  year,
  cyclesCompleted,
  cyclesTarget,
  completedReadings,
  totalReadings,
}: BibleJourneyProgressCardProps) => {
  const percent = useMemo(() => {
    if (!totalReadings) {
      return 0;
    }

    return Math.min(100, Math.round((completedReadings / totalReadings) * 100));
  }, [completedReadings, totalReadings]);

  return (
    <Card
      animated={false}
      padding="md"
      blurVariant="none"
      style={{
        borderColor: '#2D392F',
        backgroundColor: '#111713',
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#9CCAA8]">{year} Bible Journey</Text>
          <Text className="mt-2 text-[24px] font-extrabold text-[#F2F8F4]">{cyclesCompleted.toFixed(2)} / {cyclesTarget} Cycles</Text>
          <Text className="mt-1 text-[12px] text-[#A8C9B2]">Goal: read the full Bible twice this year.</Text>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#1B2C1F]">
          <Feather name="trending-up" size={18} color="#7DDA98" />
        </View>
      </View>

      <View className="mt-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[11px] font-semibold text-[#D9EEE0]">Overall yearly progress</Text>
          <Text className="text-[11px] font-bold text-[#92E4AB]">{percent}%</Text>
        </View>

        <View className="h-2.5 rounded-full bg-[#213026]">
          <View
            className="h-2.5 rounded-full bg-[#16A34A]"
            style={{
              width: `${percent}%`,
            }}
          />
        </View>

        <Text className="mt-2 text-[11px] text-[#A8C9B2]">{completedReadings} of {totalReadings} daily readings completed</Text>
      </View>
    </Card>
  );
};

export default BibleJourneyProgressCard;
