import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

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
  <View className={`self-start rounded-full border px-2.5 py-1 ${badgeVariantClass[variant]}`} style={style}>
    <Text className={`text-[11px] font-bold capitalize ${labelVariantClass[variant]}`}>{label}</Text>
  </View>
);

export default Badge;
