import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';
import { useSyncClerkAuth } from '@services/auth';
import { colors, spacing } from '../../lib/theme';

const iconMap: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  home: 'grid',
  scan: 'aperture',
  ai: 'cpu',
  'bible-journey': 'book-open',
  profile: 'user-check',
};

const labelMap: Record<string, string> = {
  home: 'Home',
  scan: 'Scan QR',
  ai: 'Counselor',
  'bible-journey': 'Bible Journey',
  profile: 'Profile',
};

const TabIcon = ({
  focused,
  icon,
}: {
  focused: boolean;
  icon: React.ComponentProps<typeof Feather>['name'];
}) => {
  const scale = useSharedValue(focused ? 1 : 0.94);
  const lift = useSharedValue(focused ? -5 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.94, { damping: 14, stiffness: 170 });
    lift.value = withSpring(focused ? -5 : 0, { damping: 16, stiffness: 180 });
  }, [focused, lift, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const frameAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
  }));

  return (
    <Animated.View style={[animStyle, frameAnimStyle]} className="items-center justify-center">
      <View
        className={`relative h-[34px] w-[34px] items-center justify-center rounded-[11px] border ${focused ? 'border-[#FF7A00] bg-[#1A1A1A]' : 'border-transparent bg-transparent'}`}
      >
        {focused ? <View className="absolute -top-[2px] h-[4px] w-[22px] rounded-full bg-[#FF7A00]" /> : null}
        <Feather name={icon} size={focused ? 22 : 21} color={focused ? colors.accentOrange : '#A1A1A1'} />
      </View>
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
    activeRoute.name === 'bible-journey' ||
    activeRoute.name === 'bible-reading' ||
    activeRoute.name === 'bible-reading-reflection' ||
    activeRoute.name === 'bible-reflection-intro';

  const visibleRoutes = state.routes.filter(
    (route) =>
      route.name !== 'digest' &&
      route.name !== 'edit-profile' &&
      route.name !== 'bible-journey' &&
        route.name !== 'bible-reading' &&
        route.name !== 'bible-reading-reflection' &&
        route.name !== 'bible-reflection-intro',
  );
  const tabCount = visibleRoutes.length || 1;
  const horizontalPadding = 12;
  const tabWidth = containerWidth > 0 ? (containerWidth - horizontalPadding * 2) / tabCount : 0;
  const currentIndex = Math.max(
    0,
    visibleRoutes.findIndex((route) => route.key === activeRoute.key),
  );

  const sliderX = useSharedValue(0);

  React.useEffect(() => {
    sliderX.value = withTiming(currentIndex * tabWidth + 4, { duration: 220 });
  }, [currentIndex, sliderX, tabWidth]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value }],
  }));

  if (shouldHideTabBar) {
    return null;
  }

  return (
    <View
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 74 + insets.bottom,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        backgroundColor: '#111111',
        borderTopWidth: 1,
        borderColor: '#2A2A2A',
        shadowColor: '#000000',
        shadowOpacity: 0.28,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -6 },
        elevation: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: spacing.xs,
          paddingBottom: Math.max(insets.bottom, spacing.xs),
          paddingHorizontal: horizontalPadding,
        }}
      >
        {tabWidth > 0 ? (
          <Animated.View
            style={[
              sliderStyle,
              {
                position: 'absolute',
                left: horizontalPadding,
                width: tabWidth - 8,
                top: 8,
                bottom: Math.max(insets.bottom, spacing.xs) + 4,
                borderRadius: 16,
                backgroundColor: '#1A1A1A',
                borderWidth: 1,
                borderColor: '#2D2D2D',
              },
            ]}
          />
        ) : null}

        {visibleRoutes.map((route) => {
          const routeOptions = descriptors[route.key]?.options;
          const isFocused = state.index === state.routes.findIndex((item) => item.key === route.key);
          const label = labelMap[route.name] ?? (typeof routeOptions?.title === 'string' ? routeOptions.title : route.name);

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
              <TabIcon focused={isFocused} icon={iconMap[route.name]} />
              <Text className={`mt-[2px] text-[10px] font-semibold ${isFocused ? 'text-[#FF7A00]' : 'text-[#9A9A9A]'}`}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const AppLayout = () => {
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
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
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
