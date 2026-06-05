import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import Badge from '@components/Badge';
import ScreenBackground from '@components/ScreenBackground';
import { colors, formatDate, getTimeGreeting, radius, spacing, typography } from '../../lib/theme';
import { mockDailyDigest, mockEvents } from '../../services/mockData';

const roleInsightMap: Record<string, string> = {
  MEMBER: 'Stay rooted in prayer, serve someone intentionally, and share one word of encouragement today.',
  STEWARD: 'Attendance confidence is trending up. Prioritize outreach to members who missed two gatherings.',
  LEADER: 'You have high momentum this week. Focus on mentoring and multiplying leadership moments.',
  ADMIN: 'Your ministry operations are healthy. Keep events, care pathways, and communication aligned.',
  SUPER_ADMIN: 'Cross-team visibility is strong. Continue guiding strategic goals with clarity and compassion.',
};

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const quickActions = [
    { id: 'scan', title: 'Scan Attendance', icon: 'maximize', route: '/(app)/scan' },
    { id: 'ai', title: 'Ask AI Guide', icon: 'message-square', route: '/(app)/ai' },
    { id: 'events', title: 'Explore Events', icon: 'calendar', route: '/(app)/members' },
    { id: 'profile', title: 'Growth Profile', icon: 'user', route: '/(app)/profile' },
  ] as const;

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textPrimary} />}
      >
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text style={styles.greeting}>{getTimeGreeting()}, {user?.firstName}</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(40)}>
          <Card variant="elevated" blurVariant="strong" padding="lg" style={styles.heroCard}>
            <View style={styles.heroTop}>
              <Badge label="Visionary Command" variant="primary" />
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Your spiritual momentum is rising.</Text>
            <Text style={styles.heroBody}>{mockDailyDigest.prayerFocus}</Text>
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>92%</Text>
                <Text style={styles.metricLabel}>Attendance</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>7</Text>
                <Text style={styles.metricLabel}>Growth Streak</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>4</Text>
                <Text style={styles.metricLabel}>Open Actions</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(80)} style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.gridItem} onPress={() => router.push(action.route as any)} activeOpacity={0.86}>
              <Card padding="md" blurVariant="soft" animated={false} style={styles.actionCard}>
                <View style={styles.actionIconWrap}>
                  <Feather name={action.icon} size={18} color={colors.primaryStrong} />
                </View>
                <Text style={styles.gridLabel}>{action.title}</Text>
                <Feather name="arrow-up-right" size={14} color={colors.textMuted} />
              </Card>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120)} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/members')}>
              <Text style={styles.sectionLink}>View all</Text>
            </TouchableOpacity>
          </View>
          {mockEvents.map((event) => (
            <Card key={event.id} padding="md" blurVariant="soft" style={styles.eventCard}>
              <View style={styles.eventRow}>
                <View style={styles.eventMetaWrap}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>{event.time} • {event.location}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textSecondary} />
              </View>
            </Card>
          ))}
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(160)} style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Devotional Highlight</Text>
          <Card padding="lg" blurVariant="strong">
            <Text style={styles.insightTitle}>{mockDailyDigest.devotional.title}</Text>
            <Text style={styles.insightText}>{mockDailyDigest.devotional.reflection}</Text>
            <Text style={styles.insightVerse}>{mockDailyDigest.devotional.scripture}</Text>
            <Text style={styles.insightBody}>{roleInsightMap[user?.role || 'MEMBER']}</Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  header: {
    marginTop: spacing.md,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: '700',
  },
  date: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  heroCard: {
    borderColor: 'rgba(255,122,26,0.4)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(53,208,127,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(53,208,127,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: colors.accentGreen,
  },
  liveText: {
    color: colors.accentGreen,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  heroBody: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    marginTop: spacing.xs,
  },
  metricsRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metricBox: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    color: colors.primaryStrong,
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
  },
  actionCard: {
    minHeight: 110,
    justifyContent: 'space-between',
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,122,26,0.16)',
  },
  gridLabel: {
    color: colors.textPrimary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  section: {
    gap: spacing.sm,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: '700',
  },
  sectionLink: {
    color: colors.primaryStrong,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  eventCard: {
    marginBottom: spacing.xs,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  eventMetaWrap: {
    flex: 1,
  },
  eventTitle: {
    color: colors.textPrimary,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  eventMeta: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    marginTop: 2,
  },
  insightTitle: {
    color: colors.primaryStrong,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  insightText: {
    color: colors.textPrimary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  insightVerse: {
    color: colors.accentGreen,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  insightBody: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    marginTop: spacing.sm,
  },
});

export default HomeScreen;
