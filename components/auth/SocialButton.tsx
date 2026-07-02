import React from 'react';
import { Pressable, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';

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

const BRAND_ICONS: Record<NonNullable<SocialButtonProps['brand']>, React.ComponentProps<typeof FontAwesome5>['name']> = {
  apple: 'apple',
  google: 'google',
  facebook: 'facebook-f',
};

const BRAND_NAMES: Record<NonNullable<SocialButtonProps['brand']>, string> = {
  apple: 'Apple',
  google: 'Google',
  facebook: 'Facebook',
};

const SocialButton = ({ icon: Icon, brand = 'google', onPress }: SocialButtonProps) => {
  const fallbackLabel = BRAND_LABELS[brand];
  const brandIcon = BRAND_ICONS[brand];

  return (
    <Pressable
      onPress={onPress}
      className="h-14 w-14 items-center justify-center rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#121212]"
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${BRAND_NAMES[brand]}`}
    >
      {Icon ? (
        <Icon size={22} color="#FFFFFF" strokeWidth={2} />
      ) : brandIcon ? (
        <FontAwesome5 name={brandIcon} size={20} color="#FFFFFF" solid={brand === 'facebook'} />
      ) : (
        <Text className="text-[20px] font-semibold text-white">{fallbackLabel}</Text>
      )}
    </Pressable>
  );
};

export default SocialButton;
