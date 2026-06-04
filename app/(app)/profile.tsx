import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import Button from '@components/Button';

const ProfileScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const menuItems = [
    {
      icon: '📝',
      label: 'Edit Profile',
      onPress: () => {
        // Navigate to edit profile
      },
    },
    {
      icon: '🔔',
      label: 'Notifications',
      toggle: true,
      value: notifications,
      onToggle: setNotifications,
    },
    {
      icon: '🌙',
      label: 'Dark Mode',
      toggle: true,
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      icon: '🔐',
      label: 'Change Password',
      onPress: () => {
        // Navigate to change password
      },
    },
    {
      icon: '📚',
      label: 'Help & Support',
      onPress: () => {
        // Navigate to help
      },
    },
    {
      icon: '📋',
      label: 'Terms & Privacy',
      onPress: () => {
        // Navigate to terms
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View style={styles.headerSection} entering={FadeIn.duration(400)}>
          <View style={styles.profileCard}>
            <Text style={styles.avatar}>👤</Text>
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.roleContainer}>
              <Text style={styles.roleBadge}>{user?.role}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          style={styles.statsSection}
          entering={SlideInUp.duration(500).delay(100)}
        >
          <Card variant="outlined">
            <View style={styles.statsGrid}>
              <View style={styles.statCol}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statCol}>
                <Text style={styles.statValue}>380</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statCol}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Services</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Member Info */}
        <Animated.View
          style={styles.section}
          entering={SlideInUp.duration(500).delay(200)}
        >
          <Text style={styles.sectionTitle}>Member Information</Text>
          <Card variant="outlined">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
            <View style={[styles.infoRow, styles.borderTop]}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.borderTop]}>
              <Text style={styles.infoLabel}>Church</Text>
              <Text style={styles.infoValue}>Grace Community Church</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Settings */}
        <Animated.View
          style={styles.section}
          entering={SlideInUp.duration(500).delay(300)}
        >
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              activeOpacity={0.7}
              disabled={item.toggle}
            >
              <Card variant="outlined" animated={false}>
                <View style={styles.menuItem}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#64748b', true: '#fbbf24' }}
                      thumbColor="#fff"
                    />
                  ) : (
                    <Text style={styles.menuArrow}>→</Text>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View
          style={styles.section}
          entering={SlideInUp.duration(500).delay(400)}
        >
          <Button
            onPress={handleLogout}
            title="Sign Out"
            variant="danger"
            fullWidth
          />
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>Visionary v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    fontSize: 64,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  roleContainer: {
    marginTop: 12,
  },
  roleBadge: {
    backgroundColor: '#fbbf24',
    color: '#111226',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#2d3a5a',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopColor: '#2d3a5a',
    borderTopWidth: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 16,
    color: '#64748b',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '400',
  },
});

export default ProfileScreen;
