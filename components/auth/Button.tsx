import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  iconRight?: boolean;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button = ({
  label,
  onPress,
  variant = 'primary',
  fullWidth = true,
  iconRight = false,
  disabled = false,
}: ButtonProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 120 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === 'primary';

  return (
    <AnimatedPressable
      className={`${fullWidth ? 'w-full' : ''} ${isPrimary ? 'bg-[#FF7A00]' : 'bg-transparent'} h-[54px] flex-row items-center justify-center rounded-[14px] border ${isPrimary ? 'border-[#FF7A00]' : 'border-[rgba(255,255,255,0.16)]'} ${disabled ? 'opacity-60' : ''}`}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text className={`text-[15px] font-semibold ${isPrimary ? 'text-white' : 'text-white'}`}>{label}</Text>
      {iconRight ? (
        <View className="absolute right-3 h-6 w-6 items-center justify-center rounded-full bg-[rgba(255,255,255,0.22)]">
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />
        </View>
      ) : null}
    </AnimatedPressable>
  );
};

export default Button;
