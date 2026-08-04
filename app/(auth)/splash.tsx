import React, { useEffect } from 'react';
import { Image, ImageBackground, Text, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
  const colorScheme = useColorScheme();
  const { isLoaded, isSignedIn } = useAuth();
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const entrance = useSharedValue(0);
  const pulse = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  const isDark = colorScheme !== 'light';

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

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0.32, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(entrance.value, [0.32, 1], [16, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View className="flex-1 bg-[#090909]" style={screenStyle}>
      <ImageBackground
        source={require('../../assets/images/splash-bg.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <LinearGradient
          colors={
            isDark
              ? ['rgba(8,8,8,0.38)', 'rgba(8,8,8,0.2)', 'rgba(8,8,8,0.7)']
              : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)', 'rgba(0,0,0,0.55)']
          }
          className="absolute inset-0"
        />

        <View className="flex-1 items-center justify-between px-7 pb-12" style={{ paddingTop: '22%' }}>
          <Animated.View
            className="absolute h-[190px] w-[190px] rounded-full bg-[rgba(255,122,0,0.25)]"
            style={[
              { top: '24%', shadowColor: ORANGE, shadowOpacity: 0.42, shadowRadius: 48, shadowOffset: { width: 0, height: 0 } },
              glowStyle,
            ]}
          />

          <Animated.View className="mt-[26px] items-center justify-center" style={logoStyle}>
            <Image source={require('../../assets/icons/fire.png')} resizeMode="contain" className="h-[92px] w-[92px]" />
          </Animated.View>

          <Animated.View className="mt-2 items-center gap-[9px]" style={textStyle}>
            <Text className="text-center text-[48px] font-bold leading-[52px]" style={{ color: isDark ? '#FFFFFF' : '#111111' }}>
              Visionary
            </Text>
            <Text className="text-center text-[12px] font-semibold leading-4 tracking-[1px]" style={{ color: isDark ? 'rgba(255,255,255,0.92)' : '#1F1F1F' }}>
              GROW IN FAITH. LIVE HIS PURPOSE.
            </Text>
          </Animated.View>

          <Animated.View className="mt-auto w-full items-center" style={textStyle}>
            <Text className="mb-[14px] text-[12px] font-medium leading-4 text-[#F2F2F2]">Preparing your journey...</Text>
            <View className="h-1 w-[136px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.3)]">
              <View className="h-full w-[74%] rounded-full bg-[#FF7A00]" />
            </View>
          </Animated.View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default SplashScreen;
