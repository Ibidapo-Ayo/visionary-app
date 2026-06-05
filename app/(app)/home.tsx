import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import Badge from '@components/Badge';
import ScreenBackground from '@components/ScreenBackground';
import { colors, formatDate, getTimeGreeting, spacing, typography } from '../../lib/theme';
import { mockDailyDigest, mockEvents } from '../../services/mockData';

const roleInsightMap: Record<string, string> = {
  MEMBER: 'Stay rooted through prayer, service, and fellowship this week.',
  STEWARD: 'Review attendance patterns and connect with at-risk members early.',
  LEADER: 'Lead your team with intention and close out pending follow-ups.',
  ADMIN: 'Prioritize high-impact ministry operations and resource visibility.',
  SUPER_ADMIN: 'Monitor organizational health and align leadership priorities.',
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
    { id: 'scan', title: 'Check-in', icon: 'qrcode-scan', route: '/(app)/scan' },
    { id: 'ai', title: 'Ask AI', icon: 'message-processing-outline', route: '/(app)/ai' },
    { id: 'events', title: 'Events', icon: 'calendar-month-outline', route: '/(app)/members' },
    { id: 'profile', title: 'Profile', icon: 'account-circle-outline', route: '/(app)/profile' },
  ];

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
          <Card variant="elevated" blurVariant="strong" padding="lg">
            <Badge label="Daily Digest" variant="primary" />
            <Text style={styles.heroTitle}>{mockDailyDigest.devotional.title}</Text>
            <Text style={styles.heroBody}>{mockDailyDigest.devotional.reflection}</Text>
            <Text style={styles.heroMeta}>{mockDailyDigest.devotional.scripture}</Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(80)} style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.gridItem} onPress={() => router.push(action.route as any)} activeOpacity={0.86}>
              <Card padding="md" blurVariant="soft" animated={false}>
                <MaterialCommunityIcons name={action.icon as any} size={24} color={colors.accentTeal} />
                <Text style={styles.gridLabel}>{action.title}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {mockEvents.map((event) => (
            <Card key={event.id} padding="md" blurVariant="soft" style={styles.eventCard}>
              <View style={styles.eventRow}>
                <View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>{event.time} • {event.location}</Text>
                </View>
                <Badge label="Open" variant="info" />
              </View>
            </Card>
          ))}
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(160)} style={styles.section}>
          <Text style={styles.sectionTitle}>Spiritual Insight</Text>
          <Card padding="lg" blurVariant="strong">
            <Text style={styles.insightText}>{roleInsightMap[user?.role || 'MEMBER']}</Text>
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
  heroMeta: {
    color: colors.accentGold,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
  },
  gridLabel: {
    color: colors.textPrimary,
    fontSize: typography.bodySm.fontSize,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: '700',
  },
  eventCard: {
    marginBottom: spacing.xs,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  insightText: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});

export default HomeScreen;
