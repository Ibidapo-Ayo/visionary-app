import React, { useEffect, useMemo } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
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
import { MAX_CONTENT_WIDTH, moderateScale, scaleFont, useResponsive } from '@/lib/responsive';

const CONFETTI_COLORS = ['#FF7A00', '#16A34A', '#FFD9A8', '#FFC488', '#FFFFFF'];

const ConfettiPiece = ({ index }: { index: number }) => {
  const left = useMemo(() => 6 + ((index * 37) % 88), [index]);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 6 + (index % 4) * 2;
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(
      (index % 8) * 90,
      withTiming(1, { duration: 1400 + (index % 6) * 120, easing: Easing.out(Easing.quad) })
    );
  }, [fall, index]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - fall.value * 0.92,
    transform: [
      { translateY: fall.value * 320 },
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
  const { width, height, isTablet } = useResponsive();
  const params = useLocalSearchParams<{ period?: string; reference?: string }>();
  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';
  const reference = typeof params.reference === 'string' ? params.reference : '';

  const { morningComplete, eveningComplete, nextActionablePeriod } = useReadingPeriodLock();
  const { currentStreak, longestStreak, newRecordThisCompletion } = useStreak();

  const dailyCompleted = morningComplete && eveningComplete;
  const isNewLongestStreak = currentStreak > 0 && newRecordThisCompletion;

  const badgeScale = useSharedValue(0.4);
  const glow = useSharedValue(0.86);
  const ctaLift = useSharedValue(0);

  useEffect(() => {
    badgeScale.value = withSequence(
      withDelay(120, withSpring(1.08, { damping: 8, stiffness: 160 })),
      withSpring(1, { damping: 9, stiffness: 180 })
    );
    glow.value = withRepeat(withTiming(1.15, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
    ctaLift.value = withRepeat(withSequence(withTiming(-3, { duration: 900 }), withTiming(0, { duration: 900 })), -1, true);
  }, [badgeScale, glow]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: interpolate(glow.value, [0.86, 1.15], [0.62, 0.95]),
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ctaLift.value }],
  }));

  const title = dailyCompleted ? "Today's Reading Complete!" : `${period === 'morning' ? 'Morning' : 'Evening'} Session Complete!`;
  const subtitle = dailyCompleted
    ? 'You showed up for both sessions today. That is spiritual consistency in motion.'
    : `Great work finishing ${reference || 'this session'}. Keep this momentum moving forward.`;
  const encouragementLabel = dailyCompleted ? 'You are building holy consistency' : 'Strong start. Keep going.';
  const encouragementText = dailyCompleted
    ? 'Your day is complete. Rest with peace and come back ready for the next morning reading.'
    : `Your next focus is the ${nextActionablePeriod === 'evening' ? 'evening' : 'morning'} period. One more step today.`;
  const scriptureText = dailyCompleted
    ? 'Galatians 6:9 - Let us not grow weary in doing good, for at the proper time we will reap a harvest.'
    : 'Psalm 119:105 - Your word is a lamp to my feet and a light to my path.';

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

  const horizontalPadding = isTablet ? Math.max((width - MAX_CONTENT_WIDTH) / 2, 20) : 20;

  return (
    <LinearGradient colors={['#FFFFFF', '#FFF8F1', '#F5FAF7']} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <View className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#FF7A00]/10" />
      <View className="absolute -left-8 top-24 h-28 w-28 rounded-full bg-[#16A34A]/12" />

      {Array.from({ length: 20 }).map((_, index) => (
        <ConfettiPiece key={index} index={index} />
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: height,
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: horizontalPadding,
        }}
      >
        <View className="w-full self-center">
          <Animated.View entering={FadeIn.duration(320)} className="items-center">
            <Animated.View
              style={glowStyle}
              className="h-40 w-40 items-center justify-center rounded-full border border-[#FFDAB8] bg-[#FFF4E8]"
            >
              <Animated.View
                style={badgeStyle}
                className="h-24 w-24 items-center justify-center rounded-full bg-[#FF7A00]"
              >
                <Feather name="check" size={42} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(320)} className="mt-7 items-center">
            <Text className="text-center font-black text-[#151515]" style={{ fontSize: scaleFont(30), lineHeight: scaleFont(34) }}>
              {title}
            </Text>
            <Text className="mt-3 text-center text-[13px] font-semibold leading-6 text-[#625A52]">{subtitle}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(240).duration(320)}
            className="mt-7 overflow-hidden rounded-[24px] border border-[#F0E3D5] bg-white px-6 py-5"
            style={{
              shadowColor: '#111111',
              shadowOpacity: 0.08,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-center">
              <View className="items-center px-5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FFF1E5]">
                  <Feather name="flame" size={18} color="#FF7A00" />
                </View>
                <Text className="mt-2 font-black text-[#191919]" style={{ fontSize: scaleFont(24) }}>
                  {currentStreak}
                </Text>
                <Text className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#7D766E]">Current Streak</Text>
              </View>

              <View className="h-14 w-[1px] bg-[#EFE4D8]" />

              <View className="items-center px-5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-[#E9F7ED]">
                  <Feather name="award" size={18} color="#16A34A" />
                </View>
                <Text className="mt-2 font-black text-[#191919]" style={{ fontSize: scaleFont(24) }}>
                  {longestStreak}
                </Text>
                <Text className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#7D766E]">Best Streak</Text>
              </View>
            </View>

            {isNewLongestStreak && currentStreak > 1 ? (
              <Animated.View
                entering={FadeInDown.delay(310).duration(320)}
                className="mt-4 flex-row items-center self-center rounded-full border border-[#BDEBC8] bg-[#EAFBF0] px-4 py-2"
              >
                <Feather name="trending-up" size={13} color="#16A34A" />
                <Text className="ml-2 text-[11px] font-black text-[#12853D]">New personal best streak!</Text>
              </Animated.View>
            ) : null}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(320).duration(320)}
            className="mt-5 rounded-[22px] border border-[#DCEEDD] bg-[#F6FCF8] px-4 py-4"
          >
            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#16A34A]/15">
                <Feather name="heart" size={15} color="#16A34A" />
              </View>
              <Text className="ml-2 flex-1 text-[13px] font-black text-[#164525]">{encouragementLabel}</Text>
            </View>
            <Text className="mt-3 text-[12px] font-semibold leading-5 text-[#36513F]">{encouragementText}</Text>
            <Text className="mt-3 text-[11px] font-bold leading-5 text-[#5B7867]">{scriptureText}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(380).duration(320)} className="mt-8 w-full" style={ctaStyle}>
            {nextActionablePeriod ? (
              <TouchableOpacity
                onPress={startNextSession}
                activeOpacity={0.92}
                style={{ paddingVertical: moderateScale(15, 0.25) }}
                className="w-full items-center rounded-[18px] bg-[#FF7A00]"
              >
                <Text className="font-black text-white" style={{ fontSize: scaleFont(15) }}>
                  Continue to {nextActionablePeriod === 'evening' ? 'Evening' : 'Morning'} Session
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={goToJourney}
                activeOpacity={0.92}
                style={{ paddingVertical: moderateScale(15, 0.25) }}
                className="w-full items-center rounded-[18px] bg-[#FF7A00]"
              >
                <Text className="font-black text-white" style={{ fontSize: scaleFont(15) }}>View Bible Journey</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={goHome}
              activeOpacity={0.85}
              style={{ paddingVertical: moderateScale(15, 0.25) }}
              className="mt-3 w-full items-center rounded-[18px] border border-[#E5DCCF] bg-white"
            >
              <Text className="font-black text-[#2A241F]" style={{ fontSize: scaleFont(14.5) }}>Return to Home</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(460).duration(300)} className="mt-4 items-center">
            <Text className="text-[11px] font-semibold text-[#8B847B]">One reading at a time. One faithful day at a time.</Text>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ReadingCompleteScreen;
