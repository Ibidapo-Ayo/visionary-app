import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../../lib/theme';

const iconMap: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  home: 'home',
  scan: 'maximize',
  ai: 'message-square',
  members: 'users',
  profile: 'user',
};

const labelMap: Record<string, string> = {
  home: 'Home',
  scan: 'Scan',
  ai: 'AI',
  members: 'Events',
  profile: 'Profile',
};

const TabIcon = ({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
}) => {
  const scale = useSharedValue(focused ? 1 : 0.94);
  const translateY = useSharedValue(focused ? -2 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.94, { damping: 14, stiffness: 170 });
    translateY.value = withSpring(focused ? -2 : 0, { damping: 15, stiffness: 180 });
  }, [focused, scale, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.iconShell, focused && styles.iconShellActive, animStyle]}>
      <Feather name={icon} size={19} color={focused ? colors.primaryStrong : colors.textMuted} />
      <Text style={[styles.iconLabel, focused && styles.iconLabelActive]}>{label}</Text>
    </Animated.View>
  );
};

const AppLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.hidden,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabItem,
        tabBarActiveTintColor: colors.primaryStrong,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={iconMap[route.name]} label={labelMap[route.name]} />,
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
    height: 82,
    borderRadius: radius.xl,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(20,18,15,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,122,26,0.22)',
  },
  tabItem: {
    paddingVertical: 2,
  },
  hidden: {
    display: 'none',
    fontSize: typography.caption.fontSize,
  },
  iconShell: {
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  iconShellActive: {
    backgroundColor: 'rgba(255,122,26,0.14)',
  },
  iconLabel: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  iconLabelActive: {
    color: colors.primaryStrong,
  },
});

export default AppLayout;
