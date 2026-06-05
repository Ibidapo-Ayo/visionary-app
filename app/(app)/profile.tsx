import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import Button from '@components/Button';
import ScreenBackground from '@components/ScreenBackground';
import { colors, spacing, typography } from '../../lib/theme';

const ProfileScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn}>
          <Card variant="elevated" blurVariant="strong" padding="lg">
            <View style={styles.identityRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</Text>
              </View>
              <View style={styles.identityMeta}>
                <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.role}>{user?.role}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(60)}>
          <Card padding="lg" blurVariant="soft">
            <Text style={styles.sectionTitle}>Spiritual Journey</Text>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>45</Text>
                <Text style={styles.metricLabel}>Events</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>92%</Text>
                <Text style={styles.metricLabel}>Attendance</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>12</Text>
                <Text style={styles.metricLabel}>Prayers</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120)}>
          <Card padding="lg" blurVariant="soft">
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelWrap}>
                <MaterialCommunityIcons name="bell-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.settingLabel}>Push notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(82,210,198,0.6)' }}
                thumbColor={colors.textPrimary}
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(180)}>
          <Button title="Sign Out" onPress={handleLogout} variant="danger" fullWidth />
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
    gap: spacing.md,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(121,168,255,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(121,168,255,0.5)',
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
  },
  identityMeta: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
  },
  email: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  role: {
    color: colors.accentGold,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    color: colors.accentTeal,
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  settingLabel: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
});

export default ProfileScreen;
