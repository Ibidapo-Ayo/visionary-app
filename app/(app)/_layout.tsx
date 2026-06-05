import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../lib/theme';

const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  home: 'home-outline',
  scan: 'qrcode-scan',
  ai: 'message-processing-outline',
  members: 'account-group-outline',
  profile: 'account-circle-outline',
};

const AppLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <MaterialCommunityIcons name={iconMap[route.name]} size={size ?? 22} color={focused ? colors.textPrimary : color} />
          </View>
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
      <Tabs.Screen name="ai" options={{ title: 'AI' }} />
      <Tabs.Screen name="members" options={{ title: 'Events' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    height: 72,
    borderRadius: radius.xl,
    paddingTop: spacing.xs,
    backgroundColor: 'rgba(18,33,68,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  label: {
    fontSize: typography.caption.fontSize,
    marginTop: -2,
    fontWeight: '600',
  },
  iconWrap: {
    padding: 6,
    borderRadius: 12,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(157,141,255,0.3)',
  },
});

export default AppLayout;
