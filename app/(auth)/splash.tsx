import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  ScaleIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import { useAppStore } from '@store/appStore';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(1, { duration: 3000 }, () => {
      runOnJS(handleNavigate)();
    });
  }, []);

  const handleNavigate = () => {
    if (isAuthenticated) {
      router.replace('/(app)/home');
    } else if (isOnboardingComplete) {
      router.replace('/(auth)/login');
    } else {
      router.replace('/(auth)/onboarding');
    }
  };

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.3, 1],
      [0, 1, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationProgress.value,
      [0, 1],
      [0.8, 1.1],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0.3, 0.6, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      {/* Glow effect background */}
      <Animated.View style={[styles.glow, glowAnimatedStyle]} />

      {/* Logo & Text */}
      <Animated.View
        style={[styles.content, textAnimatedStyle]}
        entering={ScaleIn.duration(1000)}
      >
        <Text style={styles.title}>VISIONARY</Text>
        <Text style={styles.subtitle}>Ministry Operating System</Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.dots, textAnimatedStyle]}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    top: '50%',
    left: '50%',
    marginLeft: -150,
    marginTop: -150,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fbbf24',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  dots: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
  },
});

export default SplashScreen;
