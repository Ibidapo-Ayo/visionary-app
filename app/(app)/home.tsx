import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import Button from '@components/Button';
import Badge from '../../components/Badge';
import {
  colors,
  spacing,
  typography,
  getTimeGreeting,
  formatDate,
} from '../../lib/theme';
import { mockDailyDigest, mockEvents } from '../../services/mockData';

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const quickActions = [
    { id: 'scan', title: 'Check-In', icon: 'Scan', route: '/(app)/scan' },
    { id: 'ai', title: 'AI Chat', icon: 'Chat', route: '/(app)/ai' },
    { id: 'members', title: 'Members', icon: 'People', route: '/(app)/members' },
    { id: 'prayer', title: 'Prayers', icon: 'Pray', route: '/(app)/ai' },
  ];

  const upcomingEvents = mockEvents.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Section */}
        <Animated.View style={styles.headerSection} entering={FadeIn}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getTimeGreeting()}, {user?.firstName}!</Text>
              <Text style={styles.date}>{formatDate(new Date())}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero Card - Next Event */}
        <Animated.View style={styles.heroContainer} entering={SlideInUp}>
          <Card variant="elevated" padding="lg">
            <View style={styles.heroContent}>
              <Badge label="Next Event" variant="primary" />
              <Text style={styles.heroTitle}>Sunday Service</Text>
              <Text style={styles.heroSubtitle}>10:00 AM at Main Sanctuary</Text>
              <Button title="View Details" onPress={() => {}} size="sm" />
            </View>
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={styles.section} entering={SlideInUp}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route)}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionLabel}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Daily Digest */}
        <Animated.View style={styles.section} entering={SlideInUp}>
          <Text style={styles.sectionTitle}>Today's Digest</Text>
          <Card padding="md">
            <Text style={styles.digestLabel}>Daily Devotional</Text>
            <Text style={styles.digestTitle}>{mockDailyDigest.devotional.title}</Text>
            <Text style={styles.digestScripture}>{mockDailyDigest.devotional.scripture}</Text>
            <Text style={styles.digestText}>{mockDailyDigest.devotional.reflection}</Text>
            <Button title="Read More" variant="tertiary" size="sm" onPress={() => {}} />
          </Card>
        </Animated.View>

        {/* Upcoming Events */}
        <Animated.View style={styles.section} entering={SlideInUp}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {upcomingEvents.map((event) => (
            <Card key={event.id} padding="md" style={{ marginBottom: spacing.md }}>
              <View style={styles.eventCard}>
                <View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDetail}>Time: {event.time}</Text>
                  <Text style={styles.eventDetail}>Location: {event.location}</Text>
                </View>
                <Badge label="Register" variant="info" />
              </View>
            </Card>
          ))}
        </Animated.View>

        {/* Prayer Focus */}
        <Animated.View style={styles.section} entering={SlideInUp}>
          <Card padding="md">
            <Text style={styles.prayerLabel}>Prayer Focus</Text>
            <Text style={styles.prayerText}>{mockDailyDigest.prayerFocus}</Text>
          </Card>
        </Animated.View>

        {/* Bottom Padding */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  date: {
    fontSize: typography.body.small.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 20,
  },
  heroContainer: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: typography.heading.h1.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  heroSubtitle: {
    fontSize: typography.body.medium.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  section: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: typography.caption.medium.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  digestLabel: {
    fontSize: typography.caption.large.fontSize,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  digestTitle: {
    fontSize: typography.heading.h3.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  digestScripture: {
    fontSize: typography.caption.large.fontSize,
    color: colors.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  digestText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventTitle: {
    fontSize: typography.heading.h3.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  eventDetail: {
    fontSize: typography.body.small.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  prayerLabel: {
    fontSize: typography.caption.large.fontSize,
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  prayerText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default HomeScreen;

