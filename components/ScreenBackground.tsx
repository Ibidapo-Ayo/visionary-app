import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../lib/theme';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenBackground = ({ children, style }: ScreenBackgroundProps) => {
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
    <View style={[styles.container, style]}>
      <LinearGradient colors={gradients.screen} style={StyleSheet.absoluteFillObject} />
      <Animated.View style={[styles.orbOne, orbAStyle]}>
        <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      </Animated.View>
      <Animated.View style={[styles.orbTwo, orbBStyle]}>
        <LinearGradient colors={gradients.warm} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      </Animated.View>
      {particles.map((particle) => (
        <View
          key={particle.key}
          style={[
            styles.particle,
            { top: particle.top, left: particle.left as any, width: particle.size, height: particle.size },
          ]}
        />
      ))}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  orbOne: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 220,
    top: -120,
    right: -110,
  },
  orbTwo: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 200,
    bottom: -110,
    left: -90,
  },
  particle: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: 'rgba(10,147,54,0.12)',
  },
});

export default ScreenBackground;
