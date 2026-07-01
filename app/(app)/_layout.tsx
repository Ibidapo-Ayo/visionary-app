import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, spacing } from '../../lib/theme';

const iconMap: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  home: 'grid',
  scan: 'camera',
  ai: 'star',
  members: 'users',
  profile: 'user',
};

const labelMap: Record<string, string> = {
  home: 'Home',
  scan: 'Scan',
  ai: 'AI',
  members: 'People',
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
    <Animated.View style={animStyle} className="min-w-[58px] items-center justify-center gap-1 rounded-[18px] px-2 py-2">
      <Feather name={icon} size={18} color={focused ? colors.accentOrange : '#DBF6E5'} />
      <Text className={`text-[11px] font-semibold ${focused ? 'text-[#FF6B09]' : 'text-[#DBF6E5]'}`}>{label}</Text>
      {focused ? <View className="mt-0.5 h-[3px] w-[18px] rounded-full bg-[#FF6B09]" /> : null}
    </Animated.View>
  );
};

const AppLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: spacing.md,
          right: spacing.md,
          bottom: spacing.md,
          height: 84,
          borderRadius: 24,
          paddingVertical: spacing.xs,
          backgroundColor: colors.primary,
          borderWidth: 1,
          borderColor: 'rgba(10,147,54,0.38)',
          shadowColor: '#065A22',
          shadowOpacity: 0.22,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        },
        tabBarLabelStyle: { display: 'none' },
        tabBarShowLabel: false,
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarActiveTintColor: colors.primaryStrong,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={iconMap[route.name]} label={labelMap[route.name]} />,
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
      <Tabs.Screen name="ai" options={{ title: 'AI' }} />
      <Tabs.Screen name="members" options={{ title: 'People' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
};

export default AppLayout;
