import React from 'react';
import { Text, View } from 'react-native';
import { CircleCheckBig } from 'lucide-react-native';

const PasswordRequirementCard = () => {
  return (
    <View className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#121212] p-4">
      <View className="flex-row items-center gap-2">
        <CircleCheckBig size={16} color="#16A34A" strokeWidth={2} />
        <Text className="text-[13px] text-[#16A34A]">At least 8 characters</Text>
      </View>
      <View className="mt-1.5 flex-row items-center gap-2">
        <CircleCheckBig size={16} color="#16A34A" strokeWidth={2} />
        <Text className="text-[13px] text-[#16A34A]">One uppercase letter</Text>
      </View>
      <View className="mt-1.5 flex-row items-center gap-2">
        <CircleCheckBig size={16} color="#16A34A" strokeWidth={2} />
        <Text className="text-[13px] text-[#16A34A]">One number</Text>
      </View>
    </View>
  );
};

export default PasswordRequirementCard;
