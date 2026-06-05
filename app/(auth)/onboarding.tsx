import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from '../../store/appStore';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ScreenBackground from '../../components/ScreenBackground';
import { colors, radius, spacing, typography } from '../../lib/theme';

const slides = [
  {
    title: 'Enter a living story of purpose',
    description: 'Immersive storytelling, motion, and spiritual clarity welcome every user in the first seconds.',
    icon: 'sunrise',
    chip: 'Purpose',
  },
  {
    title: 'Grow through meaningful rhythms',
    description: 'Track spiritual momentum, attendance, and habits through elegant progress experiences.',
    icon: 'trending-up',
    chip: 'Growth',
  },
  {
    title: 'Build stronger community impact',
    description: 'Create deeper belonging with event discovery, care moments, and connected leadership workflows.',
    icon: 'users',
    chip: 'Community',
  },
  {
    title: 'Lead with visionary confidence',
    description: 'Unlock AI-powered guidance, devotional intelligence, and actionable ministry insight cards.',
    icon: 'compass',
    chip: 'Leadership',
  },
] as const;

const OnboardingScreen = () => {
  const router = useRouter();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const [index, setIndex] = useState(0);

  const current = slides[index];
  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);

  const finish = () => {
    setOnboardingComplete(true);
    router.replace('/(auth)/login');
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressValue, { width: `${progress}%` }]} />
          </View>
          <TouchableOpacity onPress={finish}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          key={current.title}
          entering={SlideInRight.duration(320)}
          exiting={SlideOutLeft.duration(220)}
          style={styles.heroWrap}
        >
          <Card variant="elevated" padding="lg" blurVariant="strong" style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.iconWrap}>
                <Feather name={current.icon} color={colors.primaryStrong} size={24} />
              </View>
              <Text style={styles.chip}>{current.chip}</Text>
            </View>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.description}>{current.description}</Text>
            <View style={styles.statRow}>
              <View style={styles.statPill}>
                <Feather name="zap" size={12} color={colors.primaryStrong} />
                <Text style={styles.statText}>Motion-first UX</Text>
              </View>
              <View style={styles.statPill}>
                <Feather name="heart" size={12} color={colors.accentGreen} />
                <Text style={styles.statText}>Community-led</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(360)} exiting={FadeOut.duration(200)} style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((slide, slideIndex) => (
              <TouchableOpacity
                key={slide.title}
                onPress={() => setIndex(slideIndex)}
                style={[styles.dot, slideIndex === index && styles.dotActive]}
              />
            ))}
          </View>

          {index < slides.length - 1 ? (
            <Button
              title="Continue"
              onPress={() => setIndex((prev) => prev + 1)}
              icon={<Feather name="arrow-right" color="#1A120B" size={16} />}
              fullWidth
            />
          ) : (
            <Button title="Enter Visionary" onPress={finish} fullWidth />
          )}
        </Animated.View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'space-between',
  },
  topBar: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressValue: {
    height: '100%',
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.pill,
  },
  skip: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  heroWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  heroCard: {
    minHeight: 420,
    justifyContent: 'center',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,122,26,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,122,26,0.34)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    color: colors.primaryStrong,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  statRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  footer: {
    gap: spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 26,
    backgroundColor: colors.primaryStrong,
  },
});

export default OnboardingScreen;
