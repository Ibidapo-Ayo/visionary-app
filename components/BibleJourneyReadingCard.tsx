import React from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import { colors } from '../lib/theme';

interface BibleJourneyReadingCardProps {
  title: string;
  reference: string;
  estimatedMinutes: number;
  focus: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  accentColor: string;
}

const BibleJourneyReadingCard = ({
  title,
  reference,
  estimatedMinutes,
  focus,
  icon,
  accentColor,
}: BibleJourneyReadingCardProps) => {
  return (
    <Card
      animated={false}
      padding="md"
      blurVariant="none"
      style={{
        borderColor: '#2B2B2B',
        backgroundColor: '#121212',
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#8F8F8F]">{title}</Text>
          <Text className="mt-2 text-[21px] font-extrabold text-[#FAFAFA]">{reference}</Text>
          <Text className="mt-1 text-[12px] leading-5 text-[#B9B9B9]">{focus}</Text>
        </View>

        <View
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}26` }}
        >
          <Feather name={icon} size={18} color={accentColor} />
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between rounded-2xl border border-[#2D2D2D] bg-[#171717] px-3 py-2.5">
        <View className="flex-row items-center gap-2">
          <Feather name="clock" size={13} color={colors.accentOrange} />
          <Text className="text-[11px] font-semibold text-[#E2E2E2]">{estimatedMinutes} min read</Text>
        </View>

        <View className="rounded-full border border-[#333333] bg-[#1C1C1C] px-2.5 py-1">
          <Text className="text-[10px] font-semibold text-[#CFCFCF]">Bible Journey</Text>
        </View>
      </View>
    </Card>
  );
};

export default BibleJourneyReadingCard;
