import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/appStore';

const ORANGE = '#FF7A00';
const GREEN = '#16A34A';
const BLACK = '#111111';
const WHITE = '#FFFFFF';

type SlideId = 'daily-word' | 'ai-insights' | 'grow-together';

type Slide = {
  id: SlideId;
  iconType: 'feather' | 'material';
  iconName: string;
  iconColor: string;
  iconBackground: string;
  line1: string;
  line2Prefix: string;
  line2Highlight: string;
  description: string;
  image: any;
  badgeType: 'feather' | 'material';
  badgeName: string;
  badgeColor: string;
  ctaLabel?: string;
};

const slides: Slide[] = [
  {
    id: 'daily-word',
    iconType: 'feather',
    iconName: 'book-open',
    iconColor: ORANGE,
    iconBackground: 'rgba(255, 122, 0, 0.14)',
    line1: "Read God's Word",
    line2Prefix: '',
    line2Highlight: 'daily.',
    description: 'Stay consistent with a guided reading plan that helps you grow.',
    image: require('../../assets/images/onboarding/slide1.png'),
    badgeType: 'feather',
    badgeName: 'check',
    badgeColor: ORANGE,
  },
  {
    id: 'ai-insights',
    iconType: 'material',
    iconName: 'auto-awesome',
    iconColor: GREEN,
    iconBackground: 'rgba(22, 163, 74, 0.14)',
    line1: 'Reflect with',
    line2Prefix: '',
    line2Highlight: 'AI insights.',
    description: "Get simple, meaningful explanations and practical ways to apply God's Word.",
    image: require('../../assets/images/onboarding/slide2.png'),
    badgeType: 'material',
    badgeName: 'auto-awesome',
    badgeColor: GREEN,
  },
  {
    id: 'grow-together',
    iconType: 'feather',
    iconName: 'trending-up',
    iconColor: ORANGE,
    iconBackground: 'rgba(255, 122, 0, 0.14)',
    line1: 'Build consistency.',
    line2Prefix: '',
    line2Highlight: 'Grow together.',
    description: 'Track your progress, build streaks, earn achievements and stay encouraged.',
    image: require('../../assets/images/onboarding/slide4.png'),
    badgeType: 'feather',
    badgeName: 'users',
    badgeColor: ORANGE,
    ctaLabel: "Let's Begin",
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OnboardingScreen = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);

  const [index, setIndex] = useState(0);

  const contentProgress = useSharedValue(0);
  const iconScale = useSharedValue(0.96);
  const ctaScale = useSharedValue(1);

  const isDark = colorScheme === 'dark';
  const isLastSlide = index === slides.length - 1;
  const current = slides[index];
  const surfaceColor = isDark ? '#0C0C0C' : '#FBF8F2';
  const badgeSurface = isDark ? '#161616' : '#FFFFFF';
  const isCompactHeight = height < 760;
  const isVeryCompactHeight = height < 690;

  const horizontalPadding = Math.min(Math.max(width * 0.06, 18), 28);
  const headerTopPadding = Math.max(insets.top + (isCompactHeight ? 0 : 4), isCompactHeight ? 10 : 16);
  const contentBottomPadding = Math.max(insets.bottom + (isCompactHeight ? 8 : 12), isCompactHeight ? 14 : 22);
  const maxContentWidth = Math.min(width - horizontalPadding * 2, 460);
  const imageHeight = isVeryCompactHeight
    ? Math.min(Math.max(height * 0.3, 210), 250)
    : isCompactHeight
      ? Math.min(Math.max(height * 0.34, 228), 300)
      : Math.min(Math.max(height * 0.4, 270), 410);
  const headingClassName = 'text-[40px] leading-[48px]';
  const descriptionSize = isCompactHeight ? (width < 360 ? 14 : 15) : width < 360 ? 16 : 17;
  const descriptionLineHeight = descriptionSize + (isCompactHeight ? 8 : 11);
  const imageBorderRadius = isCompactHeight ? 28 : 34;
  const featureIconSize = isCompactHeight ? 44 : 48;
  const featureIconRadius = isCompactHeight ? 13 : 14;
  const badgeSize = isCompactHeight ? 50 : 56;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    contentProgress.value = 0;
    iconScale.value = 0.96;

    contentProgress.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
    iconScale.value = withSpring(1, { damping: 12, stiffness: 170 });
  }, [contentProgress, iconScale, index]);

  const finish = () => {
    setOnboardingComplete(true);
    router.replace('/(auth)/login');
  };

  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const goNext = () => {
    if (isLastSlide) {
      finish();
      return;
    }

    setIndex((prev) => prev + 1);
  };

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-14, 14])
        .failOffsetY([-20, 20])
        .onEnd(({ translationX, velocityX }) => {
          const shouldGoNext = translationX < -56 || velocityX < -620;
          const shouldGoPrev = translationX > 56 || velocityX > 620;

          if (shouldGoNext) {
            runOnJS(goNext)();
            return;
          }

          if (shouldGoPrev) {
            runOnJS(goPrev)();
          }
        }),
    [isLastSlide]
  );

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(contentProgress.value, [0, 1], [0.15, 1]),
    transform: [{ translateY: interpolate(contentProgress.value, [0, 1], [12, 0]) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  const renderHeroIcon = (slide: Slide, size = 22) => {
    if (slide.iconType === 'material') {
      return <MaterialIcons name={slide.iconName as keyof typeof MaterialIcons.glyphMap} size={size} color={slide.iconColor} />;
    }

    return <Feather name={slide.iconName as keyof typeof Feather.glyphMap} size={size} color={slide.iconColor} />;
  };

  const renderBadgeIcon = (slide: Slide, size = 20) => {
    if (slide.badgeType === 'material') {
      return <MaterialIcons name={slide.badgeName as keyof typeof MaterialIcons.glyphMap} size={size} color={slide.badgeColor} />;
    }

    return <Feather name={slide.badgeName as keyof typeof Feather.glyphMap} size={size} color={slide.badgeColor} />;
  };

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View
        entering={FadeIn.duration(350)}
        className="flex-1"
        style={[
          {
            backgroundColor: surfaceColor,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <Animated.View
          key={current.id}
          entering={SlideInRight.duration(420).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutLeft.duration(230)}
          className="flex-1"
          style={{ paddingTop: headerTopPadding, paddingBottom: contentBottomPadding }}
        >
          <View className="min-h-[34px] items-end justify-center">
            <Pressable onPress={finish} hitSlop={10}>
              <Text className="text-[17px] font-medium leading-6" style={{ color: isDark ? 'rgba(255,255,255,0.82)' : 'rgba(17,17,17,0.86)' }}>
                Skip
              </Text>
            </Pressable>
          </View>

          <Animated.View className="w-full flex-1 self-center pt-[10px]" style={[{ maxWidth: maxContentWidth }, contentStyle]}>
            <Animated.View style={iconStyle}>
              <View
                className="items-center justify-center"
                style={[
                  {
                    width: featureIconSize,
                    height: featureIconSize,
                    borderRadius: featureIconRadius,
                    backgroundColor: slideColorBackground(current, isDark),
                  },
                ]}
              >
                {renderHeroIcon(current)}
              </View>
            </Animated.View>

            <View style={{ marginTop: isCompactHeight ? 12 : 16 }}>
              <Text className={`font-bold tracking-[-0.2px] ${headingClassName}`} style={{ color: isDark ? WHITE : BLACK }}>
                {current.line1}
              </Text>
              <Text className={`font-bold tracking-[-0.2px] ${headingClassName}`} style={{ color: isDark ? WHITE : BLACK }}>
                {current.line2Prefix}
                <Text className={`font-bold tracking-[-0.2px] ${headingClassName}`} style={{ color: current.iconColor }}>
                  {current.line2Highlight}
                </Text>
              </Text>
            </View>

            <Text
              className="max-w-[360px] font-medium"
              style={[
                {
                  marginTop: isCompactHeight ? 8 : 10,
                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(17,17,17,0.8)',
                  fontSize: descriptionSize,
                  lineHeight: descriptionLineHeight,
                },
              ]}
            >
              {current.description}
            </Text>

            <View
              className="relative overflow-hidden border"
              style={[
                {
                  marginTop: isCompactHeight ? 18 : 26,
                  borderRadius: imageBorderRadius,
                  height: imageHeight,
                  borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,17,17,0.08)',
                },
              ]}
            >
              <Image source={current.image} resizeMode="cover" className="h-full w-full" />

              <View
                className="absolute items-center justify-center border"
                style={[
                  {
                    top: isCompactHeight ? 10 : 12,
                    right: isCompactHeight ? 10 : 12,
                    width: badgeSize,
                    height: badgeSize,
                    borderRadius: badgeSize / 2,
                    backgroundColor: badgeSurface,
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.03)',
                  },
                ]}
              >
                {renderBadgeIcon(current)}
              </View>

              <View pointerEvents="none" className="absolute bottom-[-1px] left-0 right-0 h-[42px]">
                <View className="absolute bottom-0 left-[-16px] h-[36px] w-[112px] rounded-tl-[28px] rounded-tr-[44px]" style={{ backgroundColor: surfaceColor }} />
                <View className="absolute bottom-0 right-[-16px] h-[36px] w-[112px] rounded-tl-[44px] rounded-tr-[28px]" style={{ backgroundColor: surfaceColor }} />
                <View className="absolute bottom-0 left-[22%] right-[22%] h-[22px] rounded-t-[22px]" style={{ backgroundColor: surfaceColor }} />
              </View>
            </View>

            <View style={{ marginTop: isCompactHeight ? 14 : 20 }}>
              <View className="min-h-[18px] flex-row items-center justify-center gap-2" style={{ marginBottom: isCompactHeight ? 12 : 18 }}>
                {slides.map((slide, slideIndex) => {
                  const active = slideIndex === index;
                  const dotColor = active
                    ? slide.iconColor
                    : isDark
                      ? 'rgba(255,255,255,0.38)'
                      : 'rgba(17,17,17,0.2)';

                  return (
                    <Pressable
                      key={slide.id}
                      onPress={() => setIndex(slideIndex)}
                      hitSlop={8}
                      className="min-h-4 min-w-4 items-center justify-center"
                    >
                      <Animated.View
                        className="rounded-full"
                        style={[
                          {
                            width: active ? 14 : 8,
                            height: active ? 8 : 8,
                            backgroundColor: dotColor,
                          },
                        ]}
                      />
                    </Pressable>
                  );
                })}
              </View>

              {isLastSlide ? (
                <AnimatedPressable
                  entering={FadeInDown.duration(320)}
                  onPress={finish}
                  onPressIn={() => {
                    ctaScale.value = withSpring(0.97);
                  }}
                  onPressOut={() => {
                    ctaScale.value = withSpring(1);
                  }}
                  className="h-[58px] items-center justify-center rounded-full bg-[#FF7A00]"
                  style={ctaStyle}
                >
                  <Text className="text-[14px] font-bold leading-[22px] text-white">{current.ctaLabel}</Text>
                  <View className="absolute right-[11px] h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Feather name="arrow-right" size={18} color={ORANGE} />
                  </View>
                </AnimatedPressable>
              ) : null}

              <Pressable
                onPress={finish}
                hitSlop={8}
                className="min-h-8 flex-row items-center justify-center"
                style={{ marginTop: isLastSlide ? (isCompactHeight ? 10 : 12) : 6 }}
              >
                <Text className="text-[14px] font-medium leading-5" style={{ color: isDark ? 'rgba(255,255,255,0.74)' : 'rgba(17,17,17,0.68)' }}>
                  Already have an account?{' '}
                </Text>
                <Text className="text-[14px] font-bold leading-5" style={{ color: ORANGE }}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const slideColorBackground = (slide: Slide, isDark: boolean) => {
  if (!isDark) {
    return slide.iconBackground;
  }

  if (slide.iconColor === GREEN) {
    return 'rgba(22, 163, 74, 0.25)';
  }

  return 'rgba(255, 122, 0, 0.25)';
};

export default OnboardingScreen;
