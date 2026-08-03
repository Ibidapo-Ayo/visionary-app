import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';
import { useSyncClerkAuth } from '@services/auth';
import { useSupabaseClerkAuth } from '@services/supabase';
import { colors } from '../../lib/theme';

const iconMap: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  home: 'home',
  scan: 'plus',
  'bible-journey': 'book-open',
  leaderboard: 'award',
  profile: 'user',
};

const labelMap: Record<string, string> = {
  home: 'Home',
  scan: '',
  'bible-journey': 'Journey',
  leaderboard: 'Leaderboard',
  profile: 'Profile',
};

const visibleTabOrder = ['home', 'bible-journey', 'scan', 'leaderboard', 'profile'];

const TabIcon = ({
  focused,
  icon,
}: {
  focused: boolean;
  icon: React.ComponentProps<typeof Feather>['name'];
}) => {
  const scale = useSharedValue(focused ? 1.03 : 1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.03 : 1, { damping: 16, stiffness: 190 });
  }, [focused, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle} className="items-center justify-center">
      <Feather name={icon} size={20} color={focused ? '#FF7A00' : '#5F6368'} />
    </Animated.View>
  );
};

const CenterTabIcon = ({ focused, icon }: { focused: boolean; icon: React.ComponentProps<typeof Feather>['name'] }) => {
  const scale = useSharedValue(focused ? 1.04 : 1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.04 : 1, { damping: 15, stiffness: 210 });
  }, [focused, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF7A00',
          shadowColor: '#FF7A00',
          shadowOpacity: 0.34,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 7,
        },
      ]}
    >
      <Feather name={icon} size={30} color="#FFFFFF" />
    </Animated.View>
  );
};

const AppTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = React.useState(0);

  const activeRoute = state.routes[state.index];
  const shouldHideTabBar =
    activeRoute.name === 'digest' ||
    activeRoute.name === 'edit-profile' ||
    activeRoute.name === 'ai' ||
    activeRoute.name === 'bible-reading-select' ||
    activeRoute.name === 'bible-reading' ||
    activeRoute.name === 'bible-reading-reflection' ||
    activeRoute.name === 'bible-reflection-intro';

  const visibleRoutes = visibleTabOrder
    .map((routeName) => state.routes.find((route) => route.name === routeName))
    .filter((route): route is (typeof state.routes)[number] => Boolean(route));
  const tabCount = visibleRoutes.length || 1;
  const tabWidth = containerWidth > 0 ? containerWidth / tabCount : 0;

  if (shouldHideTabBar) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: Math.max(insets.bottom, 12),
      }}
    >
      <View
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 64,
          borderRadius: 20,
          paddingHorizontal: 6,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: 'rgba(17,17,17,0.06)',
          shadowColor: '#000000',
          shadowOpacity: 0.11,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        }}
      >
        {visibleRoutes.map((route) => {
          const routeOptions = descriptors[route.key]?.options;
          const isFocused = state.index === state.routes.findIndex((item) => item.key === route.key);
          const label = labelMap[route.name] ?? (typeof routeOptions?.title === 'string' ? routeOptions.title : route.name);
          const isCenterAction = route.name === 'scan';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{ width: tabWidth || `${100 / tabCount}%` }}
              className="items-center justify-center"
            >
              {isCenterAction ? (
                <View className="-mt-6 items-center justify-center">
                  <CenterTabIcon focused={isFocused} icon={iconMap[route.name]} />
                </View>
              ) : (
                <>
                  <TabIcon focused={isFocused} icon={iconMap[route.name]} />
                  <Text className={`mt-[3px] text-[8px] font-bold ${isFocused ? 'text-[#FF7A00]' : 'text-[#111111]'}`}>{label}</Text>
                  <View className={`mt-[3px] h-[2px] w-[14px] rounded-full ${isFocused ? 'bg-[#FF7A00]' : 'bg-transparent'}`} />
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const AppLayout = () => {
  useSupabaseClerkAuth();
  useSyncClerkAuth();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryStrong,
        tabBarInactiveTintColor: colors.textMuted,
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen
        name="digest"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="bible-journey"
        options={{
          title: 'Journey',
        }}
      />
      <Tabs.Screen
        name="bible-reading-select"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="bible-reading"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="bible-reading-reflection"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="bible-reflection-intro"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
          href: null,
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
};

export default AppLayout;
