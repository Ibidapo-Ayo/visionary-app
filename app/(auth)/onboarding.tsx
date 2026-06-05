import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store/appStore';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ScreenBackground from '../../components/ScreenBackground';
import { colors, radius, spacing, typography } from '../../lib/theme';

const slides = [
  {
    title: 'Belong in every moment',
    description: 'A cinematic welcome into your church community with clarity, warmth, and spiritual depth.',
    icon: 'star-four-points-outline',
    chip: 'Community',
  },
  {
    title: 'Stay present with your gatherings',
    description: 'Track events and attendance with confidence so no one in your community goes unseen.',
    icon: 'calendar-heart',
    chip: 'Attendance',
  },
  {
    title: 'Receive guided spiritual support',
    description: 'Get scripture-led insights through a calm AI companion built for ministry moments.',
    icon: 'brain',
    chip: 'AI Assistant',
  },
  {
    title: 'Lead with compassion and action',
    description: 'Coordinate follow-ups, care paths, and ministry operations in one elegant experience.',
    icon: 'hand-heart',
    chip: 'Leadership',
  },
];

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

        <Animated.View key={current.title} entering={SlideInRight.duration(280)} exiting={FadeOut.duration(180)}>
          <Card variant="elevated" padding="lg" blurVariant="strong" style={styles.heroCard}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={current.icon as any} color={colors.textPrimary} size={24} />
            </View>
            <Text style={styles.chip}>{current.chip}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.description}>{current.description}</Text>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(360)} style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((slide, slideIndex) => (
              <TouchableOpacity key={slide.title} onPress={() => setIndex(slideIndex)} style={[styles.dot, slideIndex === index && styles.dotActive]} />
            ))}
          </View>

          {index < slides.length - 1 ? (
            <Button
              title="Continue"
              onPress={() => setIndex((prev) => prev + 1)}
              icon={<MaterialCommunityIcons name="arrow-right" color="#061021" size={17} />}
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
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressValue: {
    height: '100%',
    backgroundColor: colors.accentTeal,
    borderRadius: radius.pill,
  },
  skip: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  heroCard: {
    minHeight: 380,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  chip: {
    color: colors.accentGold,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.4,
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
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.accentTeal,
  },
});

export default OnboardingScreen;
