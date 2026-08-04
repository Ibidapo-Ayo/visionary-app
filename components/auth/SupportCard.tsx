import React from 'react';
import { Text, View } from 'react-native';
import { Headset } from 'lucide-react-native';

const SupportCard = () => {
  return (
    <View className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,18,0.8)] p-4">
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,122,0,0.14)]">
          <Headset size={20} color="#FF7A00" strokeWidth={2} />
        </View>
        <View className="flex-1">
          <Text className="text-[16px] font-semibold text-white">Need help?</Text>
          <Text className="mt-1 text-[13px] leading-[18px] text-[#B7B7B7]">Contact our support team and we&apos;ll be happy to assist you.</Text>
        </View>
      </View>
    </View>
  );
};

export default SupportCard;
