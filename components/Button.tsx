import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../lib/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  gradientColors?: React.ComponentProps<typeof LinearGradient>['colors'];
}

const buttonVariantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-transparent border-[rgba(10,147,54,0.45)]',
  secondary: 'bg-[rgba(10,147,54,0.1)] border-[rgba(10,147,54,0.3)]',
  tertiary: 'bg-white border-[#D5E1D8]',
  danger: 'bg-[rgba(217,78,0,0.1)] border-[rgba(217,78,0,0.3)]',
};

const buttonSizeClass: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-[18px] py-2',
  md: 'px-[18px] py-3.5',
  lg: 'px-7 py-[18px]',
};

const labelVariantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white',
  secondary: 'text-[#A84413]',
  tertiary: 'text-[#2D3A33]',
  danger: 'text-[#D94E00]',
};

const labelSizeClass: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-[20px]',
};

const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      onPress,
      title,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      style,
      textStyle,
      fullWidth = false,
      icon,
      gradientColors = gradients.cta,
    },
    ref
  ) => {
    const isGradient = variant === 'primary';

    const content = (
      <View className="flex-row items-center justify-center gap-2">
        {icon}
        <Text className={`font-bold tracking-[0.2px] ${labelVariantClass[variant]} ${labelSizeClass[size]}`} style={textStyle}>{title}</Text>
      </View>
    );

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.88}
        className={`overflow-hidden rounded-[18px] border ${buttonVariantClass[variant]} ${(!isGradient || loading) ? buttonSizeClass[size] : ''} ${fullWidth ? 'w-full' : ''} ${(disabled || loading) ? 'opacity-50' : ''}`}
        style={style}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.white : colors.textPrimary} />
        ) : isGradient ? (
          <LinearGradient colors={gradientColors} className={`rounded-[18px] ${buttonSizeClass[size]}`} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            {content}
          </LinearGradient>
        ) : (
          content
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export default Button;
