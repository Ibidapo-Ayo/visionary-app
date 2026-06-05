import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import { useAppStore } from '@store/appStore';
import ScreenBackground from '../../components/ScreenBackground';
import { colors, spacing, typography } from '../../lib/theme';

const SplashScreen = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2600 }, () => runOnJS(navigate)());
  }, []);

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
    opacity: interpolate(progress.value, [0, 0.35, 1], [0, 1, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1.04], Extrapolation.CLAMP) }],
  }));

  const captionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.2, 0.8], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [10, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Text style={styles.logo}>VISIONARY</Text>
          <Text style={styles.tagline}>A living digital spiritual ecosystem</Text>
        </Animated.View>
        <Animated.View style={[styles.footer, captionStyle]}>
          <Text style={styles.footerText}>Centering your community experience...</Text>
        </Animated.View>
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
    marginTop: '48%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    marginTop: spacing.xs,
    color: colors.accentGold,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.bodySm.fontSize,
  },
});

export default SplashScreen;
