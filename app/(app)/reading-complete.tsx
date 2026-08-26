import React, { useEffect, useMemo } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReadingPeriod } from '@/types/index';
import { useReadingPeriodLock } from '@/hooks/useReadingPeriodLock';
import { useStreak } from '@/hooks/useStreak';

const CONFETTI_COLORS = ['#FF7A00', '#16A34A', '#FFD9A8', '#FFFFFF'];

const ConfettiPiece = ({ index }: { index: number }) => {
  const left = useMemo(() => 6 + ((index * 37) % 88), [index]);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 6 + (index % 3) * 3;
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(
      (index % 8) * 90,
      withTiming(1, { duration: 1400 + (index % 5) * 120, easing: Easing.out(Easing.quad) })
    );
  }, [fall, index]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - fall.value * 0.85,
    transform: [
      { translateY: fall.value * 260 },
      { rotate: `${fall.value * (index % 2 === 0 ? 260 : -260)}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          top: 0,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
};

const ReadingCompleteScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ period?: string; reference?: string }>();
  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';
  const reference = typeof params.reference === 'string' ? params.reference : '';

  const { morningComplete, eveningComplete, nextActionablePeriod } = useReadingPeriodLock();
  const { currentStreak, longestStreak } = useStreak();

  const dailyCompleted = morningComplete && eveningComplete;
  const isNewLongestStreak = currentStreak > 0 && currentStreak >= longestStreak;

  const badgeScale = useSharedValue(0.4);
  const glow = useSharedValue(0.85);

  useEffect(() => {
    badgeScale.value = withSequence(
      withDelay(120, withSpring(1.08, { damping: 8, stiffness: 160 })),
      withSpring(1, { damping: 9, stiffness: 180 })
    );
    glow.value = withRepeat(withTiming(1.15, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [badgeScale, glow]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
  }));

  const title = dailyCompleted ? "Today's Reading Complete!" : `${period === 'morning' ? 'Morning' : 'Evening'} Session Complete!`;
  const subtitle = dailyCompleted
    ? 'You showed up for both sessions today. Your streak is alive and growing.'
    : `Great work finishing ${reference || 'this session'}. Keep the momentum going.`;

  const goHome = () => router.replace('/(app)/home');
  const goToJourney = () => router.replace('/(app)/bible-journey');
  const startNextSession = () => {
    if (!nextActionablePeriod) {
      goToJourney();
      return;
    }

    router.replace({
      pathname: '/(app)/bible-reading-select',
      params: { period: nextActionablePeriod },
    });
  };

  return (
    <LinearGradient colors={['#111111', '#1B1B1B', '#0E0E0E']} className="flex-1">
      <StatusBar barStyle="light-content" />

      {Array.from({ length: 18 }).map((_, index) => (
        <ConfettiPiece key={index} index={index} />
      ))}

      <View className="flex-1 items-center justify-center px-6" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}>
        <Animated.View entering={FadeIn.duration(320)} style={glowStyle} className="h-40 w-40 items-center justify-center rounded-full bg-[#FF7A00]/20">
          <Animated.View style={badgeStyle} className="h-28 w-28 items-center justify-center rounded-full bg-[#FF7A00]">
            <Feather name="check" size={46} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(160).duration(320)} className="mt-8 text-center text-[26px] font-black text-white">
          {title}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(220).duration(320)} className="mt-3 text-center text-[13px] font-semibold leading-5 text-[#C9C2B8]">
          {subtitle}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(280).duration(320)}
          className="mt-8 w-full flex-row items-center justify-center rounded-[20px] border border-[#2E2E2E] bg-[#171717] px-6 py-5"
        >
          <View className="items-center px-4">
            <Feather name="flame" size={20} color="#FF9D47" />
            <Text className="mt-1 text-[20px] font-black text-white">{currentStreak}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#9B9085]">Day Streak</Text>
          </View>
          <View className="mx-2 h-10 w-[1px] bg-[#2E2E2E]" />
          <View className="items-center px-4">
            <Feather name="award" size={20} color="#FFD9A8" />
            <Text className="mt-1 text-[20px] font-black text-white">{longestStreak}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#9B9085]">Best Streak</Text>
          </View>
        </Animated.View>

        {isNewLongestStreak && currentStreak > 1 ? (
          <Animated.View entering={FadeInDown.delay(320).duration(320)} className="mt-4 flex-row items-center rounded-full bg-[#16A34A]/15 px-4 py-2">
            <Feather name="trending-up" size={14} color="#16A34A" />
            <Text className="ml-2 text-[11px] font-black text-[#16A34A]">New personal best!</Text>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(360).duration(320)} className="mt-10 w-full">
          {nextActionablePeriod ? (
            <TouchableOpacity onPress={startNextSession} activeOpacity={0.9} className="w-full items-center rounded-[18px] bg-[#FF7A00] py-4">
              <Text className="text-[14px] font-black text-white">
                Start {nextActionablePeriod === 'evening' ? 'Evening' : 'Morning'} Session
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={goToJourney} activeOpacity={0.9} className="w-full items-center rounded-[18px] bg-[#FF7A00] py-4">
              <Text className="text-[14px] font-black text-white">View Bible Journey</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={goHome} activeOpacity={0.85} className="mt-3 w-full items-center rounded-[18px] border border-[#2E2E2E] py-4">
            <Text className="text-[14px] font-black text-[#E5E1D9]">Return to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default ReadingCompleteScreen;
