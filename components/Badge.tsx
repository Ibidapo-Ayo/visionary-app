import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { moderateScale, scaleFont } from '../lib/responsive';

type BadgeVariant = 'default' | 'new' | 'at-risk' | 'success' | 'info' | 'primary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const badgeVariantClass: Record<BadgeVariant, string> = {
  default: 'border-[#E5EEE8] bg-[#F8FBF9]',
  new: 'border-[rgba(10,147,54,0.28)] bg-[rgba(10,147,54,0.12)]',
  'at-risk': 'border-[rgba(255,107,9,0.3)] bg-[rgba(255,107,9,0.12)]',
  success: 'border-[rgba(10,147,54,0.28)] bg-[rgba(10,147,54,0.12)]',
  info: 'border-[rgba(255,107,9,0.32)] bg-[rgba(255,107,9,0.12)]',
  primary: 'border-[rgba(10,147,54,0.28)] bg-[rgba(10,147,54,0.12)]',
};

const labelVariantClass: Record<BadgeVariant, string> = {
  default: 'text-[#2D3A33]',
  new: 'text-[#0A9336]',
  'at-risk': 'text-[#D94E00]',
  success: 'text-[#0A9336]',
  info: 'text-[#FF6B09]',
  primary: 'text-[#A84413]',
};

const Badge = ({ label, variant = 'default', style }: BadgeProps) => (
  <View
    className={`self-start rounded-full border ${badgeVariantClass[variant]}`}
    style={[{ paddingHorizontal: moderateScale(10, 0.35), paddingVertical: moderateScale(4, 0.35) }, style]}
  >
    <Text className={`font-bold capitalize ${labelVariantClass[variant]}`} style={{ fontSize: scaleFont(11) }}>{label}</Text>
  </View>
);

export default Badge;
