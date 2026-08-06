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
}

const BrandedSpinner = ({ size = 32 }: BrandedSpinnerProps) => {
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

  return (
    <View className="items-center justify-center" style={{ height: size, width: size }}>
      <Animated.View
        className="rounded-full border-[3px] border-[#FFE0BF] border-t-[#FF7A00]"
        style={[{ height: size, width: size }, animatedStyle]}
      />
      <View className="absolute h-2 w-2 rounded-full bg-[#16A34A]" />
    </View>
  );
};

export default BrandedSpinner;
