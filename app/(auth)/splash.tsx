import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  FadeOutUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import { useAppStore } from '@store/appStore';
import ScreenBackground from '../../components/ScreenBackground';
import { colors, gradients, spacing, typography } from '../../lib/theme';

const storyScenes = [
  'Purpose is calling.',
  'Grow with your community.',
  'Lead with vision and faith.',
  'Transform moments into impact.',
];

const SplashScreen = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const progress = useSharedValue(0);
  const breathing = useSharedValue(0);
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const sceneTimer = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % storyScenes.length);
    }, 2200);

    breathing.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    progress.value = withTiming(1, { duration: 9200, easing: Easing.out(Easing.cubic) }, () => runOnJS(navigate)());

    return () => clearInterval(sceneTimer);
  }, [breathing, progress]);

  const navigate = () => {
    if (isAuthenticated) {
      router.replace('/(app)/home');
      return;
    }
    if (isOnboardingComplete) {
      router.replace('/(auth)/login');
      return;
    }
    router.replace('/(auth)/onboarding');
  };

  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.12, 1], [0, 1, 1], Extrapolation.CLAMP),
    transform: [
      { scale: 0.94 + breathing.value * 0.05 },
      { translateY: interpolate(progress.value, [0, 1], [16, 0], Extrapolation.CLAMP) },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 16])}deg` }],
    opacity: 0.5 + breathing.value * 0.3,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(progress.value * 100, 7)}%`,
  }));

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Text style={styles.logo}>VISIONARY</Text>
          <Text style={styles.tagline}>A premium ecosystem for faith, growth, and leadership</Text>
          <Animated.View style={[styles.ring, ringStyle]} />
        </Animated.View>

        <View style={styles.storyStack}>
          <Animated.View key={sceneIndex} entering={FadeInDown.duration(420)} exiting={FadeOutUp.duration(300)} style={styles.storyLineWrap}>
            <Feather name="star" size={13} color={colors.primaryStrong} />
            <Text style={styles.storyLine}>{storyScenes[sceneIndex]}</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Preparing your immersive experience...</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressValue, progressStyle]} />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  logoWrap: {
    marginTop: '38%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    textAlign: 'center',
    maxWidth: 320,
  },
  ring: {
    marginTop: spacing.md,
    width: 86,
    height: 86,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,122,26,0.45)',
    backgroundColor: gradients.hero[1],
  },
  storyStack: {
    minHeight: 120,
    justifyContent: 'center',
    width: '100%',
  },
  storyLineWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  storyLine: {
    color: colors.accentWhite,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.bodySm.fontSize,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  progressValue: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: colors.primaryStrong,
  },
});

export default SplashScreen;
