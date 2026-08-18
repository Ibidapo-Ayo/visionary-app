import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface BrandedSpinnerProps {
  size?: number;
  tone?: 'brand' | 'light';
}

const BrandedSpinner = ({ size = 32, tone = 'brand' }: BrandedSpinnerProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 900,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const trackClassName = tone === 'light' ? 'border-white/30 border-t-white' : 'border-[#FFE0BF] border-t-[#FF7A00]';
  const dotClassName = tone === 'light' ? 'bg-white' : 'bg-[#16A34A]';

  return (
    <View className="items-center justify-center" style={{ height: size, width: size }}>
      <Animated.View className={`rounded-full border-[3px] ${trackClassName}`} style={[{ height: size, width: size }, animatedStyle]} />
      <View className={`absolute h-2 w-2 rounded-full ${dotClassName}`} />
    </View>
  );
};

export default BrandedSpinner;
