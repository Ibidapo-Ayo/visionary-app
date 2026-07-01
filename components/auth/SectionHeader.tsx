import React from 'react';
import { Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <View className="mt-7 gap-1.5">
      <Text className="text-[36px] font-bold leading-[40px] text-white">{title}</Text>
      <Text className="max-w-[300px] text-[14px] leading-[21px] text-[#AFAFAF]">{subtitle}</Text>
    </View>
  );
};

export default SectionHeader;
