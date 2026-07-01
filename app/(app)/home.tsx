import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import ScreenBackground from '@components/ScreenBackground';
import { colors, formatDate, spacing } from '../../lib/theme';
import { mockEvents } from '../../services/mockData';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - spacing.lg * 2;

const heroSlides = [
  {
    id: 'insight',
    tag: 'Today',
    title: 'Simple, clear ministry command center',
    body: 'See engagement, tasks, and actions in one glance.',
    action: 'View insights',
    icon: 'activity',
  },
  {
    id: 'community',
    tag: 'Community',
    title: 'Grow attendance with confident outreach',
    body: 'Track trends and reconnect with members at risk.',
    action: 'Open members',
    icon: 'users',
  },
  {
    id: 'assistant',
    tag: 'AI',
    title: 'Ask smarter questions. Get practical answers.',
    body: 'Built-in assistant for prayer, planning, and leadership.',
    action: 'Start chat',
    icon: 'star',
  },
] as const;

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<FlatList<(typeof heroSlides)[number]>>(null);

  const quickActions = useMemo(
    () => [
      { id: 'scan', title: 'Scan', icon: 'camera', route: '/(app)/scan' },
      { id: 'ai', title: 'Ask AI', icon: 'star', route: '/(app)/ai' },
      { id: 'members', title: 'Members', icon: 'users', route: '/(app)/members' },
      { id: 'profile', title: 'Profile', icon: 'user', route: '/(app)/profile' },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => {
        const next = (prev + 1) % heroSlides.length;
        carouselRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const handleCarouselAction = (id: string) => {
    if (id === 'assistant') {
      router.push('/(app)/ai');
      return;
    }
    if (id === 'community') {
      router.push('/(app)/members');
      return;
    }
    router.push('/(app)/profile');
  };

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="gap-7 px-7 pt-9"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryStrong} />}
      >
        <Animated.View entering={FadeIn.duration(300)} className="mt-[18px]">
          <Text className="text-[34px] font-extrabold leading-[42px] text-black">Hello, {user?.firstName || 'Leader'}</Text>
          <Text className="text-[14px] text-[#718078]">{formatDate(new Date())}</Text>
        </Animated.View>

        <Animated.View entering={SlideInUp.duration(320)}>
          <FlatList
            ref={carouselRef}
            data={heroSlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CAROUSEL_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(event.nativeEvent.contentOffset.x / CAROUSEL_WIDTH);
              setCarouselIndex(nextIndex);
            }}
            renderItem={({ item }) => (
              <View style={{ width: CAROUSEL_WIDTH, paddingRight: spacing.sm }}>
                <LinearGradient colors={['#0A9336', '#087A2D', '#076726']} className="min-h-[220px] justify-between rounded-[24px] p-7">
                  <View className="mb-[18px] flex-row items-center justify-between">
                    <View className="h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-[rgba(255,107,9,0.2)]">
                      <Feather name={item.icon} size={18} color={colors.accentOrange} />
                    </View>
                    <Text className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#D8FFE6]">{item.tag}</Text>
                  </View>
                  <Text className="mb-2 text-[26px] font-extrabold leading-[34px] text-white">{item.title}</Text>
                  <Text className="mb-[18px] text-[14px] leading-[21px] text-[#E7FFEF]">{item.body}</Text>
                  <TouchableOpacity className="self-start rounded-full bg-[#FF6B09] px-[14px] py-2" onPress={() => handleCarouselAction(item.id)}>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-[14px] font-bold text-black">{item.action}</Text>
                      <Feather name="arrow-right" size={15} color={colors.black} />
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          />

          <View className="mt-[14px] flex-row justify-center gap-2">
            {heroSlides.map((slide, index) => (
              <View key={slide.id} className={`h-2 rounded-full ${index === carouselIndex ? 'w-6 bg-[#FF6B09]' : 'w-2 bg-[#B8C8BE]'}`} />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(80).duration(320)} className="gap-[14px]">
          <Text className="text-[20px] font-bold leading-7 text-black">Quick actions</Text>
          <View className="flex-row flex-wrap gap-[14px]">
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={{ width: '48%' }} onPress={() => router.push(action.route as any)}>
                <Card padding="md" blurVariant="strong" animated={false} style={{ minHeight: 90, justifyContent: 'center', gap: 14 }}>
                  <View className="h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[rgba(10,147,54,0.12)]">
                    <Feather name={action.icon as React.ComponentProps<typeof Feather>['name']} size={17} color={colors.primaryStrong} />
                  </View>
                  <Text className="text-[16px] font-bold text-black">{action.title}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120).duration(320)} className="gap-[14px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[20px] font-bold leading-7 text-black">Upcoming</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/members')}>
              <Text className="text-[14px] font-bold text-[#FF6B09]">See all</Text>
            </TouchableOpacity>
          </View>
          {mockEvents.slice(0, 3).map((event) => (
            <Card key={event.id} padding="md" blurVariant="strong" style={{ marginBottom: 8 }}>
              <Text className="text-[16px] font-bold text-black">{event.title}</Text>
              <Text className="mt-[3px] text-[14px] text-[#718078]">{event.time} • {event.location}</Text>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
};

export default HomeScreen;
