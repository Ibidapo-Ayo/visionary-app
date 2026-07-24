import React from 'react';
import { Image, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <View className="mt-7 items-center gap-2">
      <Image source={require('../../assets/icons/fire.png')} className="h-[46px] w-[46px]" resizeMode="contain" />

      <Text className="text-center text-[40px] font-bold leading-[46px] tracking-[-1px] text-neutral-900">{title}</Text>
      <Text className="max-w-[300px] text-center text-[18px] leading-[21px] text-[#AFAFAF]">{subtitle}</Text>
    </View>
  );
};

export default SectionHeader;
