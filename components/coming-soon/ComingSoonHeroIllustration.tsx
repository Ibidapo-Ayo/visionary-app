import React, { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type ComingSoonHeroIllustrationProps = {
  accentColor?: string;
};

const ComingSoonHeroIllustration = ({ accentColor = '#FF7A00' }: ComingSoonHeroIllustrationProps) => {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  const floatValue = useSharedValue(0);
  const pulseValue = useSharedValue(0);
  const glowDrift = useSharedValue(0);

  useEffect(() => {
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 1600, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );

    glowDrift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [floatValue, pulseValue, glowDrift]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -10 * floatValue.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulseValue.value * 0.24 }],
    opacity: 0.35 - pulseValue.value * 0.25,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: glowDrift.value * 14 },
      { translateY: -glowDrift.value * 10 },
    ],
    opacity: isDark ? 0.22 + glowDrift.value * 0.08 : 0.25 + glowDrift.value * 0.1,
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.glowOrb,
          glowStyle,
          {
            backgroundColor: isDark ? 'rgba(255,122,0,0.22)' : 'rgba(255,122,0,0.25)',
          },
        ]}
      />

      <Animated.View style={[styles.pulseRing, pulseRingStyle, { borderColor: `${accentColor}66` }]} />

      <Animated.View style={[styles.mainOrb, floatStyle]}>
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255,122,0,0.85)', 'rgba(255,122,0,0.5)', 'rgba(17,17,17,0.1)']
              : ['rgba(255,122,0,0.86)', 'rgba(255,167,94,0.62)', 'rgba(255,255,255,0.24)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainGradient}
        >
          <View
            style={[
              styles.innerChip,
              {
                backgroundColor: isDark ? 'rgba(17,17,17,0.7)' : 'rgba(255,255,255,0.74)',
                borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.08)',
              },
            ]}
          >
            <Feather name="cpu" size={28} color={isDark ? '#FFE1C2' : '#7A3A0A'} />
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={[styles.satellite, styles.satelliteLeft, { backgroundColor: isDark ? 'rgba(22,163,74,0.26)' : 'rgba(22,163,74,0.2)' }]} />
      <View style={[styles.satellite, styles.satelliteRight, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(17,17,17,0.09)' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 999,
  },
  pulseRing: {
    position: 'absolute',
    width: 174,
    height: 174,
    borderRadius: 999,
    borderWidth: 1,
  },
  mainOrb: {
    width: 144,
    height: 144,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#FF7A00',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  mainGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerChip: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  satellite: {
    position: 'absolute',
    borderRadius: 999,
  },
  satelliteLeft: {
    width: 16,
    height: 16,
    top: 60,
    left: '24%',
  },
  satelliteRight: {
    width: 12,
    height: 12,
    right: '26%',
    bottom: 68,
  },
});

export default ComingSoonHeroIllustration;
