import React, { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
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
    <View className="h-[230px] items-center justify-center">
      <Animated.View
        style={[
          { position: 'absolute', width: 190, height: 190, borderRadius: 999 },
          glowStyle,
          {
            backgroundColor: isDark ? 'rgba(255,122,0,0.22)' : 'rgba(255,122,0,0.25)',
          },
        ]}
      />

      <Animated.View style={[{ position: 'absolute', width: 174, height: 174, borderRadius: 999, borderWidth: 1 }, pulseRingStyle, { borderColor: `${accentColor}66` }]} />

      <Animated.View className="h-36 w-36 overflow-hidden rounded-full" style={floatStyle}>
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255,122,0,0.85)', 'rgba(255,122,0,0.5)', 'rgba(17,17,17,0.1)']
              : ['rgba(255,122,0,0.86)', 'rgba(255,167,94,0.62)', 'rgba(255,255,255,0.24)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 items-center justify-center"
        >
          <View
            className="h-[72px] w-[72px] items-center justify-center rounded-3xl border"
            style={[
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

      <View
        className="absolute left-[24%] top-[60px] h-4 w-4 rounded-full"
        style={{ backgroundColor: isDark ? 'rgba(22,163,74,0.26)' : 'rgba(22,163,74,0.2)' }}
      />
      <View
        className="absolute bottom-[68px] right-[26%] h-3 w-3 rounded-full"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(17,17,17,0.09)' }}
      />
    </View>
  );
};

export default ComingSoonHeroIllustration;
