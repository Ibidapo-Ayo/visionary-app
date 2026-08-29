import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAuth } from '@clerk/expo';
import { useAppStore } from '@store/appStore';

const ORANGE = '#FF7A00';

const SplashScreen = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const entrance = useSharedValue(0);
  const pulse = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  const navigate = () => {
    if (!isLoaded) {
      return;
    }
    if (isSignedIn) {
      router.replace('/(app)/home');
      return;
    }
    if (isOnboardingComplete) {
      router.replace('/(auth)/login');
      return;
    }
    router.replace('/(auth)/onboarding');
  };

  useEffect(() => {
    entrance.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
    pulse.value = withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) });

    const fadeTimer = setTimeout(() => {
      fadeOut.value = withTiming(0, { duration: 700, easing: Easing.inOut(Easing.cubic) }, (finished) => {
        if (finished) {
          runOnJS(navigate)();
        }
      });
    }, 2600);

    return () => clearTimeout(fadeTimer);
  }, [entrance, fadeOut, pulse]);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: fadeOut.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0, 0.35, 1], [0, 0.9, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(entrance.value, [0, 1], [24, 0], Extrapolation.CLAMP) },
      { scale: interpolate(entrance.value, [0, 1], [0.92, 1], Extrapolation.CLAMP) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.26 + pulse.value * 0.2,
    transform: [{ scale: 0.92 + pulse.value * 0.12 }],
  }));

  return (
    <Animated.View className="flex-1 items-center justify-center bg-[#111111]" style={screenStyle}>
      <Animated.View
        className="absolute h-[160px] w-[160px] rounded-full bg-[rgba(255,122,0,0.2)]"
        style={[
          {
            shadowColor: ORANGE,
            shadowOpacity: 0.42,
            shadowRadius: 48,
            shadowOffset: { width: 0, height: 0 },
          },
          glowStyle,
        ]}
      />

      <Animated.View className="items-center justify-center" style={logoStyle}>
        <Image source={require('../../assets/icon.png')} resizeMode="contain" className="h-[96px] w-[96px]" />
      </Animated.View>
    </Animated.View>
  );
};

export default SplashScreen;
