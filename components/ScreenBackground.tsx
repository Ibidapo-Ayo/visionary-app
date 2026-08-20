import React, { useEffect, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../lib/theme';
import { MAX_CONTENT_WIDTH, useResponsive } from '../lib/responsive';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenBackground = ({ children, style }: ScreenBackgroundProps) => {
  const { isTablet } = useResponsive();
  const driftA = useSharedValue(0);
  const driftB = useSharedValue(0);

  useEffect(() => {
    driftA.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 5200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    driftB.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 6800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [driftA, driftB]);

  const orbAStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: driftA.value * 26 }, { translateY: driftA.value * -20 }],
    opacity: 0.5 + driftA.value * 0.2,
  }));

  const orbBStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -driftB.value * 18 }, { translateY: driftB.value * 24 }],
    opacity: 0.2 + driftB.value * 0.16,
  }));

  const particles = useMemo(
    () =>
      new Array(9).fill(0).map((_, index) => ({
        key: `particle-${index}`,
        top: 70 + index * 72,
        left: index % 2 === 0 ? `${8 + index * 8}%` : `${56 - index * 2}%`,
        size: index % 3 === 0 ? 5 : 4,
      })),
    []
  );

  return (
    <View className="flex-1 bg-[#F4F7F5]" style={style}>
      <LinearGradient colors={gradients.screen} className="absolute inset-0" />
      <Animated.View className="absolute -right-[110px] -top-[120px] h-[340px] w-[340px] rounded-[220px]" style={orbAStyle}>
        <LinearGradient colors={gradients.hero} className="absolute inset-0" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      </Animated.View>
      <Animated.View className="absolute -bottom-[110px] -left-[90px] h-[280px] w-[280px] rounded-[200px]" style={orbBStyle}>
        <LinearGradient colors={gradients.warm} className="absolute inset-0" start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      </Animated.View>
      {particles.map((particle) => (
        <View
          key={particle.key}
          className="absolute rounded-full bg-[rgba(10,147,54,0.12)]"
          style={[
            { top: particle.top, left: particle.left as any, width: particle.size, height: particle.size },
          ]}
        />
      ))}
      <View className={`flex-1 bg-[rgba(255,255,255,0.82)] ${isTablet ? 'items-center' : ''}`}>
        <View style={isTablet ? { width: '100%', maxWidth: MAX_CONTENT_WIDTH, flex: 1 } : { flex: 1, width: '100%' }}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default ScreenBackground;
