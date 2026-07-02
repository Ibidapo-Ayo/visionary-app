import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import BibleJourneyProgressCard from '@components/BibleJourneyProgressCard';
import { mockBibleJourneyProgress, mockBibleJourneyReadings, mockEvents } from '@services/mockData';
import { useAuthStore } from '@store/authStore';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? '';
  const lastInitial = lastName?.trim()?.charAt(0) ?? '';

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? 'V').toUpperCase();
};

const getCountdownParts = (eventStartAt: string, now: Date) => {
  const eventDate = new Date(eventStartAt);
  const diffMs = eventDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { badge: 'Live now', subtext: 'Event has started' };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days === 0) {
    if (hours === 0) {
      return { badge: 'Today', subtext: `Starts in ${minutes}m` };
    }

    return { badge: 'Today', subtext: `Starts in ${hours}h ${minutes}m` };
  }

  if (days === 1) {
    return { badge: 'Tomorrow', subtext: `Starts in ${hours}h ${minutes}m` };
  }

  return { badge: `In ${days} days`, subtext: `${hours}h ${minutes}m remaining` };
};

const formatEventDateTime = (eventStartAt: string) => {
  const date = new Date(eventStartAt);

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${formattedDate} • ${formattedTime}`;
};

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const getStreakStats = useBibleJourneyStore((state) => state.getStreakStats);
  const [now, setNow] = useState(() => new Date());
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const upcomingEvent = useMemo(() => {
    const sortedEvents = [...mockEvents].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    return sortedEvents.find((event) => new Date(event.startAt).getTime() >= now.getTime()) || sortedEvents[0];
  }, [now]);

  const countdown = useMemo(() => {
    if (!upcomingEvent) {
      return { badge: 'No events', subtext: 'No upcoming event scheduled yet' };
    }

    return getCountdownParts(upcomingEvent.startAt, now);
  }, [upcomingEvent, now]);

  const streakStats = getStreakStats();
  const currentStreak = streakStats.currentStreak;

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Visionary Member';
  const firstName = fullName.split(' ')[0] || 'Visionary';
  const userInitials = getInitials(user?.firstName, user?.lastName, user?.email);
  const profileImage = user?.profileImage?.trim() ?? '';
  const shouldShowProfileImage = !!profileImage && !avatarLoadFailed;

  return (
    <LinearGradient colors={['#040404', '#0A0A0A', '#121110']} className="flex-1">
      <StatusBar barStyle="light-content" />

      <View className="absolute -right-16 top-20 h-48 w-48 rounded-full bg-[#FF7A00]/20" />
      <View className="absolute -left-20 top-64 h-56 w-56 rounded-full bg-[#16A34A]/15" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }} className="px-5 pt-8">
        <Animated.View entering={FadeIn.duration(240)} className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.push('/(app)/profile')}
            activeOpacity={0.9}
            className="flex-row items-center rounded-full border border-[#312419] bg-[rgba(20,20,20,0.86)] px-2 py-2"
          >
            <View className="h-11 w-11 overflow-hidden rounded-full border border-[#5A4634] bg-[#1A130E]">
              {shouldShowProfileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  onError={() => setAvatarLoadFailed(true)}
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Text className="text-[16px] font-black text-[#FF7A00]">{userInitials}</Text>
                </View>
              )}
            </View>

            <View className="ml-2.5 pr-2">
              <Text className="text-[10px] uppercase tracking-[0.7px] text-[#9E9E9E]">Welcome back</Text>
              <Text className="mt-0.5 text-[13px] font-bold text-[#F6F6F6]">{firstName}</Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/(app)/bible-journey')}
              activeOpacity={0.85}
              className="flex-row items-center rounded-full border border-[#2E442F] bg-[#132015] px-3 py-2"
            >
              <Feather name="zap" size={13} color="#8EE3A8" />
              <Text className="ml-1.5 text-[11px] font-semibold text-[#D8F9E2]">{currentStreak} day streak</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(app)/digest')}
              activeOpacity={0.85}
              className="relative h-10 w-10 items-center justify-center rounded-full border border-[#3D2E20] bg-[#17130F]"
            >
              <Feather name="bell" size={16} color="#FFB16A" />
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(260)} className="overflow-hidden rounded-[30px] border border-[#3B3128]">
          <ImageBackground
            source={require('../../assets/images/home-page-image.jpg')}
            resizeMode="cover"
            imageStyle={{ opacity: 0.48 }}
            className="min-h-[284px]"
          >
            <LinearGradient
              colors={['rgba(12,9,6,0.36)', 'rgba(16,12,8,0.72)', 'rgba(8,8,8,0.92)']}
              className="min-h-[284px] px-5 pb-5 pt-4"
            >
              <View className="rounded-full self-start border border-[#5A4634] bg-[rgba(0,0,0,0.4)] px-3 py-1.5">
                <Text className="text-[10px] font-semibold uppercase tracking-[0.9px] text-[#FFD6B1]">Faith in Motion</Text>
              </View>

              <View className="mt-14">
                <Text className="text-[32px] font-black leading-[38px] text-[#FDFDFD]">Faith in motion.</Text>
                <Text className="text-[32px] font-black leading-[38px] text-[#F08E2D]">Purpose on fire.</Text>
                <Text className="mt-2 max-w-[300px] text-[12px] leading-5 text-[#E2D5C9]">
                  Your spiritual rhythm is building. Keep pressing in and let today become your evidence.
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120).duration(320)} className="mt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#919191]">Bible Journey</Text>
          <TouchableOpacity className="mt-2" onPress={() => router.push('/(app)/bible-journey')}>
            <BibleJourneyProgressCard
              year={mockBibleJourneyProgress.year}
              cyclesCompleted={mockBibleJourneyProgress.cyclesCompleted}
              cyclesTarget={mockBibleJourneyProgress.cyclesTarget}
              completedReadings={mockBibleJourneyProgress.completedReadings}
              totalReadings={mockBibleJourneyProgress.totalReadings}
            />

            <View className="mt-2 rounded-[16px] border border-[#2B2B2B] bg-[#121212] p-3.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.9px] text-[#8F8F8F]">Today's Readings</Text>
                  <Text className="mt-1 text-[12px] text-[#E7E7E7]">Morning: {mockBibleJourneyReadings[0]?.reference}</Text>
                  <Text className="mt-1 text-[12px] text-[#E7E7E7]">Evening: {mockBibleJourneyReadings[1]?.reference}</Text>
                </View>
                <View className="h-9 w-9 items-center justify-center rounded-full bg-[#1E2A20]">
                  <Feather name="arrow-up-right" size={16} color="#8EE3A8" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(180).duration(320)} className="mt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#919191]">Upcoming Events</Text>
          <Card
            animated={false}
            padding="md"
            blurVariant="none"
            style={{
              marginTop: 8,
              borderColor: '#2B2B2B',
              backgroundColor: '#121212',
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <Text className="text-[16px] font-bold text-[#FAFAFA]">{upcomingEvent?.title ?? 'No upcoming event'}</Text>
                <Text className="mt-1 text-[11px] text-[#A2A2A2]">{upcomingEvent ? formatEventDateTime(upcomingEvent.startAt) : 'Date to be announced'}</Text>
                <Text className="mt-1 text-[11px] text-[#A2A2A2]">{upcomingEvent?.location ?? 'Location to be announced'}</Text>
                <Text className="mt-2 text-[11px] leading-5 text-[#BCBCBC]">{upcomingEvent?.description ?? 'No event details available yet.'}</Text>
              </View>
              <View className="rounded-xl border border-[#315337] bg-[#132014] px-2.5 py-2">
                <Text className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#8FDCA5]">{countdown.badge}</Text>
                <Text className="mt-0.5 text-[12px] font-bold text-[#D7F7E0]">{countdown.subtext}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
