import React from 'react';
import { Alert, ScrollView, StatusBar, Text, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import ProfileHeader from '@components/profile/ProfileHeader';
import SpiritualProgressOverview from '@components/profile/SpiritualProgressOverview';
import AchievementStreaks from '@components/profile/AchievementStreaks';
import RecentSpiritualActivity from '@components/profile/RecentSpiritualActivity';
import ProfileSettingsList, {
  AppearanceControl,
  NotificationsControl,
  ProfileSettingsItem,
} from '@components/profile/ProfileSettingsList';
import {
  mockProfileAchievements,
  mockProfileMeta,
  mockRecentSpiritualActivities,
  mockSpiritualMetrics,
} from '@services/mockData';

const ProfileScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [notifications, setNotifications] = React.useState(true);
  const [appearance, setAppearance] = React.useState<'light' | 'dark' | 'system'>('system');

  const openEditProfile = () => {
    router.push('/(app)/edit-profile');
  };

  const openPlaceholder = (title: string) => {
    Alert.alert(title, 'This flow will be connected to backend and dedicated screens soon.');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const accountItems: ProfileSettingsItem[] = [
    {
      id: 'account_edit_profile',
      icon: 'edit-3',
      label: 'Edit Profile',
      value: 'Update photo, bio, and member details',
      onPress: openEditProfile,
    },
    {
      id: 'account_change_password',
      icon: 'shield',
      label: 'Change Password',
      value: 'Secure your account credentials',
      onPress: () => router.push('/(auth)/forgot-password'),
    },
    {
      id: 'account_notifications',
      icon: 'bell',
      label: 'Notification Preferences',
      value: notifications ? 'Daily reminders enabled' : 'Notifications paused',
      rightControl: <NotificationsControl enabled={notifications} onChange={setNotifications} />,
    },
    {
      id: 'account_appearance',
      icon: 'moon',
      label: 'Appearance',
      value: 'Light, Dark, or System',
      rightControl: <AppearanceControl isDark={isDark} value={appearance} onChange={setAppearance} />,
    },
    {
      id: 'account_language',
      icon: 'globe',
      label: 'Language',
      value: 'English (US)',
      onPress: () => openPlaceholder('Language Settings'),
    },
    {
      id: 'account_privacy',
      icon: 'lock',
      label: 'Privacy Settings',
      value: 'Manage profile visibility and permissions',
      onPress: () => openPlaceholder('Privacy Settings'),
    },
  ];

  const settingsItems: ProfileSettingsItem[] = [
    {
      id: 'settings_help',
      icon: 'help-circle',
      label: 'Help & Support',
      value: 'Get help from the Visionary team',
      onPress: () => openPlaceholder('Help & Support'),
    },
    {
      id: 'settings_terms',
      icon: 'file-text',
      label: 'Terms & Conditions',
      onPress: () => openPlaceholder('Terms & Conditions'),
    },
    {
      id: 'settings_privacy_policy',
      icon: 'shield-off',
      label: 'Privacy Policy',
      onPress: () => openPlaceholder('Privacy Policy'),
    },
    {
      id: 'settings_about',
      icon: 'info',
      label: 'About Visionary App',
      value: 'Version 1.0.0',
      onPress: () => openPlaceholder('About Visionary App'),
    },
    {
      id: 'settings_logout',
      icon: 'log-out',
      label: 'Logout',
      value: 'Sign out of your account',
      destructive: true,
      onPress: handleLogout,
    },
  ];

  return (
    <LinearGradient
      colors={isDark ? ['#030303', '#090909', '#111111'] : ['#FFF8EF', '#FDF4EA', '#F8F1E8']}
      className="flex-1"
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        className="px-5 pt-8"
      >
        <Animated.View entering={FadeIn.duration(260)} className="mb-4">
          <Text className="text-[28px] font-black" style={{ color: isDark ? '#F8F8F8' : '#1A1511' }}>
            Profile
          </Text>
          <Text className="mt-0.5 text-[12px]" style={{ color: isDark ? '#A2A2A2' : '#776A5B' }}>
            Your spiritual journey, account, and settings in one place
          </Text>
        </Animated.View>

        <ProfileHeader
          user={user}
          isDark={isDark}
          churchUnit={mockProfileMeta.churchUnit}
          memberId={mockProfileMeta.memberId}
          onEditProfile={openEditProfile}
        />

        <View className="mt-5">
          <SpiritualProgressOverview isDark={isDark} metrics={mockSpiritualMetrics} />
        </View>

        <View className="mt-2">
          <AchievementStreaks
            isDark={isDark}
            achievements={mockProfileAchievements}
            onViewAll={() => openPlaceholder('All Achievements')}
          />
        </View>

        <View className="mt-2">
          <RecentSpiritualActivity isDark={isDark} activities={mockRecentSpiritualActivities} />
        </View>

        <View className="mt-2">
          <ProfileSettingsList title="Account Section" isDark={isDark} items={accountItems} delay={240} />
        </View>

        <View className="mt-2">
          <ProfileSettingsList title="Settings Section" isDark={isDark} items={settingsItems} delay={300} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
