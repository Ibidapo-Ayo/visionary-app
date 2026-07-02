import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';

type ActionItem = {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  route: '/(app)/scan' | '/(app)/ai' | '/(app)/digest' | '/(app)/members';
  iconColor: string;
  glowColor: string;
};

const quickActions: ActionItem[] = [
  {
    id: 'scan',
    label: 'Fast Check-In',
    subtitle: 'Scan attendance QR in one tap',
    icon: 'aperture',
    route: '/(app)/scan',
    iconColor: '#FF9B3D',
    glowColor: 'rgba(255,122,0,0.24)',
  },
  {
    id: 'ai',
    label: 'Prayer Mode',
    subtitle: 'Talk with your AI counselor',
    icon: 'cpu',
    route: '/(app)/ai',
    iconColor: '#77DB95',
    glowColor: 'rgba(22,163,74,0.24)',
  },
  {
    id: 'digest',
    label: 'Daily Digest',
    subtitle: 'Get a 4-minute spiritual reset',
    icon: 'book-open',
    route: '/(app)/digest',
    iconColor: '#FFB56D',
    glowColor: 'rgba(255,122,0,0.2)',
  },
  {
    id: 'members',
    label: 'People Pulse',
    subtitle: 'See who showed up this week',
    icon: 'users',
    route: '/(app)/members',
    iconColor: '#B5D9BF',
    glowColor: 'rgba(181,217,191,0.16)',
  },
];

const momentumStats = [
  { id: 'streak', label: 'Prayer Streak', value: '07 days', icon: 'sunrise' as const, tint: '#FF7A00' },
  { id: 'focus', label: 'Focus Time', value: '24 mins', icon: 'clock' as const, tint: '#3FC86C' },
  { id: 'checkins', label: 'This Week', value: '3 check-ins', icon: 'check-circle' as const, tint: '#F2B878' },
];

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const firstName = useMemo(() => user?.firstName || 'David', [user?.firstName]);

  return (
    <LinearGradient colors={['#040404', '#0A0A0A', '#121110']} className="flex-1">
      <StatusBar barStyle="light-content" />

      <View className="absolute -right-16 top-20 h-48 w-48 rounded-full bg-[#FF7A00]/20" />
      <View className="absolute -left-20 top-64 h-56 w-56 rounded-full bg-[#16A34A]/15" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }} className="px-5 pt-8">
        <Animated.View entering={FadeIn.duration(260)} className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.9px] text-[#B4B4B4]">Visionary Nation</Text>
            <Text className="mt-1 text-[30px] font-black text-[#FAFAFA]">{firstName}, rise bold.</Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-[#2E2E2E] bg-[#151515]">
            <Feather name="bell" size={16} color="#F4F4F4" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={SlideInUp.duration(320)} className="overflow-hidden rounded-[30px] border border-[#3B3128]">
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
              <View className="flex-row items-center justify-between">
                <View className="rounded-full border border-[#5A4634] bg-[rgba(0,0,0,0.4)] px-3 py-1.5">
                  <Text className="text-[10px] font-semibold uppercase tracking-[0.9px] text-[#FFD6B1]">This week momentum</Text>
                </View>
                <View className="rounded-full border border-[#2F5B39] bg-[rgba(12,26,16,0.66)] px-3 py-1.5">
                  <Text className="text-[11px] font-semibold text-[#9BE0AE]">Prayer streak +2</Text>
                </View>
              </View>

              <View className="mt-14">
                <Text className="text-[32px] font-black leading-[38px] text-[#FDFDFD]">Faith in motion.</Text>
                <Text className="text-[32px] font-black leading-[38px] text-[#F08E2D]">Purpose on fire.</Text>
                <Text className="mt-2 max-w-[300px] text-[12px] leading-5 text-[#E2D5C9]">
                  Your spiritual rhythm is building. Keep pressing in and let today become your evidence.
                </Text>
              </View>

              <View className="mt-5 flex-row items-center gap-2">
                <TouchableOpacity className="rounded-full bg-[#FF7A00] px-4 py-2.5" onPress={() => router.push('/(app)/ai')}>
                  <View className="flex-row items-center gap-2">
                    <Feather name="message-circle" size={14} color="#17120D" />
                    <Text className="text-[12px] font-bold text-[#1B1309]">Start Prayer</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-full border border-[#3A3A3A] bg-[rgba(0,0,0,0.45)] px-4 py-2.5" onPress={() => router.push('/(app)/digest')}>
                  <View className="flex-row items-center gap-2">
                    <Feather name="book-open" size={14} color="#EFEFEF" />
                    <Text className="text-[12px] font-semibold text-[#EAEAEA]">Read Digest</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(70).duration(320)} className="mt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#919191]">Faith Momentum</Text>
          <View className="mt-2 flex-row gap-2">
            {momentumStats.map((item) => (
              <Card
                key={item.id}
                animated={false}
                padding="sm"
                blurVariant="none"
                style={{
                  flex: 1,
                  borderColor: '#2C2C2C',
                  backgroundColor: '#141414',
                }}
              >
                <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${item.tint}20` }}>
                  <Feather name={item.icon} size={14} color={item.tint} />
                </View>
                <Text className="mt-2 text-[17px] font-bold text-[#FAFAFA]">{item.value}</Text>
                <Text className="mt-0.5 text-[10px] font-medium text-[#9B9B9B]">{item.label}</Text>
              </Card>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120).duration(320)} className="mt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#919191]">Quick Actions</Text>
          <View className="mt-2 flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="mb-2.5 w-[48.5%] overflow-hidden rounded-[20px] border border-[#2C2C2C] bg-[#141414] p-3"
                onPress={() => router.push(action.route)}
              >
                <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: action.glowColor }}>
                  <Feather name={action.icon} size={17} color={action.iconColor} />
                </View>
                <Text className="mt-3 text-[13px] font-bold text-[#F4F4F4]">{action.label}</Text>
                <Text className="mt-1 text-[10px] leading-4 text-[#969696]">{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(170).duration(320)} className="mt-1">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#919191]">Scripture Spotlight</Text>
          <Card
            animated={false}
            padding="none"
            blurVariant="none"
            style={{
              marginTop: 8,
              borderColor: '#2B2B2B',
              backgroundColor: '#121212',
            }}
          >
            <ImageBackground
              source={require('../../assets/images/bible_verse_of_the_day.jpg')}
              resizeMode="cover"
              imageStyle={{ opacity: 0.2, borderRadius: 16 }}
              className="overflow-hidden rounded-[16px] px-4 py-4"
            >
              <View className="flex-row items-start justify-between">
                <Text className="mr-3 flex-1 text-[14px] leading-6 text-[#F3F3F3]">
                  "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm
                  you, plans to give you hope and a future."
                </Text>
                <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full border border-[#323232] bg-[#191919]">
                  <Feather name="bookmark" size={14} color="#FF7A00" />
                </TouchableOpacity>
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-[11px] font-semibold tracking-[0.4px] text-[#FFB56D]">Jeremiah 29:11</Text>
                <TouchableOpacity className="rounded-full border border-[#303030] bg-[#161616] px-3 py-1.5">
                  <Text className="text-[10px] font-semibold text-[#E2E2E2]">Share Verse</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(220).duration(320)} className="mt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#919191]">Tonight at Visionary Nation</Text>
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
                <Text className="text-[16px] font-bold text-[#FAFAFA]">Prayer and Prophetic Declarations</Text>
                <Text className="mt-1 text-[11px] text-[#A2A2A2]">8:00 PM • Main Sanctuary</Text>
                <Text className="mt-2 text-[11px] leading-5 text-[#BCBCBC]">Come expectant. We are gathering for breakthrough prayers and bold declarations.</Text>
              </View>
              <View className="rounded-xl border border-[#315337] bg-[#132014] px-2.5 py-2">
                <Text className="text-[10px] font-semibold text-[#8FDCA5]">LIVE IN</Text>
                <Text className="mt-0.5 text-[14px] font-black text-[#D7F7E0]">02:41:13</Text>
              </View>
            </View>

            <TouchableOpacity className="mt-4 rounded-full bg-[#FF7A00] px-4 py-2.5" onPress={() => router.push('/(app)/members')}>
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-[12px] font-bold text-[#1B1309]">Open Attendance</Text>
                <Feather name="arrow-right" size={14} color="#1B1309" />
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
