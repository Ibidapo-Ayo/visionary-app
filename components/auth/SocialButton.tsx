import React from 'react';
import { Pressable, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface SocialButtonProps {
  icon?: LucideIcon;
  brand?: 'apple' | 'google' | 'facebook';
  onPress?: () => void;
}

const BRAND_LABELS: Record<NonNullable<SocialButtonProps['brand']>, string> = {
  apple: 'A',
  google: 'G',
  facebook: 'f',
};

const SocialButton = ({ icon: Icon, brand = 'google', onPress }: SocialButtonProps) => {
  const fallbackLabel = BRAND_LABELS[brand];

  return (
    <Pressable
      onPress={onPress}
      className="h-14 w-14 items-center justify-center rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#121212]"
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${brand}`}
    >
      {Icon ? (
        <Icon size={22} color="#FFFFFF" strokeWidth={2} />
      ) : (
        <Text className="text-[20px] font-semibold text-white">{fallbackLabel}</Text>
      )}
    </Pressable>
  );
};

export default SocialButton;
