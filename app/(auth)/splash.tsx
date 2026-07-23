import React, { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAuth } from '@clerk/expo';
import { useAppStore } from '@store/appStore';

const ORANGE = '#FF7A00';

const particles = [
  { left: '8%', top: 82, size: 2, delay: 0, travel: -38 },
  { left: '18%', top: 238, size: 1.5, delay: 320, travel: -30 },
  { left: '76%', top: 94, size: 2, delay: 180, travel: -42 },
  { left: '88%', top: 196, size: 1.5, delay: 460, travel: -36 },
  { left: '12%', top: 532, size: 2, delay: 620, travel: -48 },
  { left: '86%', top: 498, size: 2, delay: 260, travel: -44 },
  { left: '63%', top: 606, size: 1.5, delay: 720, travel: -34 },
  { left: '34%', top: 132, size: 1.4, delay: 540, travel: -28 },
] as const;

const FloatingParticle = ({ left, top, size, delay, travel }: (typeof particles)[number]) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [delay, progress]);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.25, 0.9, 0.25], Extrapolation.CLAMP),
    transform: [{ translateY: progress.value * travel }, { scale: 0.8 + progress.value * 0.6 }],
  }));

  return (
    <Animated.View
      className="absolute rounded-full bg-[#FF7A00]"
      style={[
        { left, top, width: size, height: size, shadowColor: ORANGE, shadowOpacity: 1, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
        particleStyle,
      ]}
    />
  );
};

const EnergyWave = () => {
  const flow = useSharedValue(0);

  useEffect(() => {
    flow.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [flow]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(flow.value, [0, 1], [-22, 22]) }],
    opacity: 0.7 + flow.value * 0.25,
  }));

  return (
    <View className="absolute bottom-[54px] left-[-38px] right-[-38px] h-[150px] opacity-95" pointerEvents="none">
      <Animated.View className="h-[150px] w-[470px]" style={waveStyle}>
        <Svg width="470" height="150" viewBox="0 0 470 150">
          <Defs>
            <SvgGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={ORANGE} stopOpacity="0" />
              <Stop offset="0.28" stopColor={ORANGE} stopOpacity="0.92" />
              <Stop offset="0.7" stopColor="#FFB15C" stopOpacity="0.86" />
              <Stop offset="1" stopColor={ORANGE} stopOpacity="0" />
            </SvgGradient>
          </Defs>
          <Path d="M-18 91 C45 46 92 124 156 78 C226 28 284 120 354 73 C410 35 446 56 492 37" stroke="url(#waveStroke)" strokeWidth="2.2" fill="none" />
          <Path d="M-24 104 C52 64 90 130 170 94 C248 58 296 118 374 88 C420 70 454 74 496 58" stroke="url(#waveStroke)" strokeWidth="1" fill="none" opacity="0.55" />
          <Path d="M-10 116 C50 91 104 133 180 111 C252 90 304 129 384 106 C428 94 462 96 500 84" stroke="url(#waveStroke)" strokeWidth="0.8" fill="none" opacity="0.38" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const SplashScreen = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const entrance = useSharedValue(0);
  const pulse = useSharedValue(0);

  const ambientParticles = useMemo(() => particles, []);

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
    entrance.value = withTiming(1, { duration: 2300, easing: Easing.out(Easing.cubic) });
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    const timer = setTimeout(() => runOnJS(navigate)(), 3400);
    return () => clearTimeout(timer);
  }, [entrance, pulse]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0, 0.35, 1], [0, 0.9, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(entrance.value, [0, 1], [24, 0], Extrapolation.CLAMP) },
      { scale: interpolate(entrance.value, [0, 1], [0.92, 1], Extrapolation.CLAMP) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.34 + pulse.value * 0.22,
    transform: [{ scale: 0.96 + pulse.value * 0.08 }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0.32, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(entrance.value, [0.32, 1], [16, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <View className="flex-1 overflow-hidden bg-[#090909]">
      <LinearGradient colors={['#090909', '#111111', '#090909']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <LinearGradient colors={['rgba(255,122,0,0.28)', 'rgba(255,122,0,0.08)', 'rgba(9,9,9,0)']} style={{ position: 'absolute', width: 370, height: 370, borderRadius: 185, top: 176, alignSelf: 'center' }} />
      <LinearGradient colors={['rgba(255,255,255,0.045)', 'rgba(255,255,255,0.01)', 'rgba(255,255,255,0)']} style={{ position: 'absolute', left: 18, right: 18, top: 72, bottom: 86, borderRadius: 42, borderWidth: 1, borderColor: 'rgba(255,255,255,0.035)' }} />

      {ambientParticles.map((particle) => (
        <FloatingParticle key={`${particle.left}-${particle.top}`} {...particle} />
      ))}

      <View className="flex-1 items-center justify-center px-8 pb-[34px]">
        <Animated.View style={[{ position: 'absolute', width: 218, height: 218, borderRadius: 109, backgroundColor: 'rgba(255,122,0,0.2)', shadowColor: ORANGE, shadowOpacity: 0.42, shadowRadius: 60, shadowOffset: { width: 0, height: 0 } }, glowStyle]} />
        <Animated.View className="mb-2.5" style={logoStyle}>
          <View className="h-[138px] w-[138px] rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,122,0,0.2)]" />
        </Animated.View>

        <Animated.View className="mt-[-2px] items-center" style={textStyle}>
          <Text className="text-[28px] font-extrabold leading-[34px] tracking-[7px] text-white">VISIONARY</Text>
          <Text className="ml-2 text-[18px] font-extrabold leading-7 tracking-[9px] text-[#FF7A00]">NATION</Text>
        </Animated.View>

        <Animated.View className="mt-[34px] items-center" style={textStyle}>
          <Text className="text-[15px] leading-[22px] text-[#B7B7B7]">Your Journey.</Text>
          <Text className="text-[15px] leading-[22px] text-[#B7B7B7]">Your Growth.</Text>
          <Text className="text-[15px] leading-[22px] text-[#B7B7B7]">Your Community.</Text>
        </Animated.View>
      </View>

      <EnergyWave />
      <View className="absolute bottom-[18px] h-[5px] w-[134px] self-center rounded-full bg-white" />
    </View>
  );
};

export default SplashScreen;
