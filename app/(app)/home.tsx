import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import { useAppStore } from '@store/appStore';
import Card from '@components/Card';
import Button from '@components/Button';

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const events = useAppStore((state) => state.events);

  // Mock data
  const upcomingEvents = [
    {
      id: '1',
      title: 'Sunday Service',
      time: '10:00 AM',
      location: 'Main Hall',
      attendees: 120,
    },
    {
      id: '2',
      title: 'Youth Meeting',
      time: '6:00 PM',
      location: 'Youth Center',
      attendees: 45,
    },
  ];

  const stats = [
    { label: 'Members', value: '245', color: '#fbbf24' },
    { label: 'Attendance', value: '92%', color: '#10b981' },
    { label: 'Events', value: '8', color: '#6366f1' },
  ];

  const quickActions = [
    {
      id: 'scan',
      title: 'Check-In',
      icon: '📱',
      route: '/(app)/scan',
    },
    {
      id: 'ai',
      title: 'AI Chat',
      icon: '💬',
      route: '/(app)/ai',
    },
    {
      id: 'follow-up',
      title: 'Follow-ups',
      icon: '👥',
      route: '/(app)/members',
    },
    {
      id: 'prayer',
      title: 'Prayers',
      icon: '🙏',
      route: '/(app)/ai',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn.duration(400)}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.firstName || 'Guest'}! 👋
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Stats Card */}
        <Animated.View
          style={styles.statsContainer}
          entering={SlideInUp.duration(500).delay(100)}
        >
          <Card variant="elevated">
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text
                    style={[
                      styles.statValue,
                      { color: stat.color },
                    ]}
                  >
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={styles.section}
          entering={SlideInUp.duration(500).delay(200)}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <Card variant="default" animated={false}>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionIcon}>{action.icon}</Text>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Upcoming Events */}
        <Animated.View
          style={styles.section}
          entering={SlideInUp.duration(500).delay(300)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.map((event) => (
            <Card key={event.id} variant="outlined">
              <View style={styles.eventContent}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>
                    {event.time} • {event.location}
                  </Text>
                </View>
                <View style={styles.eventAttendees}>
                  <Text style={styles.attendeeCount}>{event.attendees}</Text>
                  <Text style={styles.attendeeLabel}>Attending</Text>
                </View>
              </View>
            </Card>
          ))}
        </Animated.View>

        {/* Call to Action */}
        <Animated.View
          style={styles.ctaSection}
          entering={SlideInUp.duration(500).delay(400)}
        >
          <Card variant="elevated">
            <Text style={styles.ctaTitle}>Need Help?</Text>
            <Text style={styles.ctaText}>
              Chat with our AI assistant for scripture references and spiritual guidance.
            </Text>
            <Button
              onPress={() => router.push('/(app)/ai')}
              title="Start Chat"
              variant="secondary"
              fullWidth
              style={styles.ctaButton}
            />
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#94a3b8',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 20,
    color: '#ef4444',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  seeAll: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  eventContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  eventMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  eventAttendees: {
    alignItems: 'center',
  },
  attendeeCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fbbf24',
  },
  attendeeLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaButton: {
    marginBottom: 0,
  },
});

export default HomeScreen;
