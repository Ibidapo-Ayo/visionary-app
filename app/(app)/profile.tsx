import React from 'react';
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@store/authStore';
import { useSignOut } from '@services/auth';
import { mockProfileAchievements, mockRecentSpiritualActivities, mockSpiritualMetrics } from '@services/mockData';

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? '';
  const lastInitial = lastName?.trim()?.charAt(0) ?? '';

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? 'V').toUpperCase();
};

const StatCard = ({ icon, value, label, tint }: { icon: React.ComponentProps<typeof Feather>['name']; value: string; label: string; tint: string }) => (
  <View className="flex-1 items-center rounded-[16px] border border-[#EFE7DD] bg-white px-2 py-3">
    <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${tint}18` }}>
      <Feather name={icon} size={15} color={tint} />
    </View>
    <Text className="mt-2 text-[18px] font-black text-[#171717]">{value}</Text>
    <Text className="mt-0.5 text-center text-[9px] font-bold text-[#80776D]">{label}</Text>
  </View>
);

const AchievementBadge = ({ icon, title, subtitle, tint }: { icon: React.ReactNode; title: string; subtitle: string; tint: string }) => (
  <View className="w-[23%] items-center">
    <View className="h-[52px] w-[52px] items-center justify-center rounded-full" style={{ backgroundColor: `${tint}18` }}>
      {icon}
    </View>
    <Text className="mt-2 text-center text-[10px] font-black leading-3 text-[#25211C]">{title}</Text>
    <Text className="mt-0.5 text-center text-[8px] font-semibold leading-[10px] text-[#8B8278]">{subtitle}</Text>
  </View>
);

const RecentReflectionRow = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ComponentProps<typeof Feather>['name'] }) => (
  <TouchableOpacity activeOpacity={0.84} className="flex-row items-center rounded-[16px] border border-[#EFE7DD] bg-white px-3 py-3">
    <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#FFF2E7]">
      <Feather name={icon} size={16} color="#FF7A00" />
    </View>
    <View className="ml-3 flex-1">
      <Text className="text-[12px] font-black text-[#231F1A]">{title}</Text>
      <Text className="mt-0.5 text-[10px] font-semibold text-[#8A8176]">{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={17} color="#A29A90" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const logout = useSignOut();
  const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);

  const userInitials = getInitials(user?.firstName, user?.lastName, user?.email);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Visionary Member';
  const profileImage = user?.profileImage?.trim() ?? '';
  const shouldShowProfileImage = !!profileImage && !avatarLoadFailed;

  const yearlyGoal = mockSpiritualMetrics.find((metric) => metric.id === 'metric_overall')?.progress ?? 0.71;
  const monthlyGoalPercent = 20;
  const recentReflections = mockRecentSpiritualActivities.filter((activity) => activity.type === 'reflection' || activity.type === 'bibleReading').slice(0, 3);

  const handleLogout = async () => {
    const result = await logout();
    if (!result.success && result.error) {
      Alert.alert('Sign Out Failed', result.error.message);
      return;
    }
    router.replace('/(auth)/login');
  };

  const openProfileMenu = () => {
    Alert.alert('Profile Settings', 'Manage your profile and account.', [
      { text: 'Edit Profile', onPress: () => router.push('/(app)/edit-profile') },
      { text: 'Sign Out', style: 'destructive', onPress: handleLogout },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F7F1E8]">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 116, 136) }}>
        <LinearGradient colors={['#101010', '#151515', '#1B1B1B']} className="rounded-b-[28px] px-5 pb-7" style={{ paddingTop: insets.top + 14 }}>
          <View className="absolute inset-0 opacity-20">
            <View className="absolute left-[-40px] top-8 h-52 w-52 rounded-full border border-[#333333]" />
            <View className="absolute right-[-72px] top-20 h-64 w-64 rounded-full border border-[#3A3A3A]" />
            <View className="absolute left-20 top-36 h-32 w-32 rounded-full border border-[#2E2E2E]" />
          </View>

          <View className="flex-row items-center justify-end">
            <TouchableOpacity onPress={openProfileMenu} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Feather name="settings" size={17} color="#F6F2EE" />
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeIn.duration(280)} className="items-center">
            <TouchableOpacity onPress={() => router.push('/(app)/edit-profile')} activeOpacity={0.88} className="relative mt-1">
              <View className="h-[94px] w-[94px] overflow-hidden rounded-full border-[4px] border-white bg-[#252525]">
                {shouldShowProfileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" onError={() => setAvatarLoadFailed(true)} />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="text-[30px] font-black text-[#FF7A00]">{userInitials}</Text>
                  </View>
                )}
              </View>
              <View className="absolute bottom-1 right-1 h-7 w-7 items-center justify-center rounded-full border-2 border-[#101010] bg-[#FF7A00]">
                <Feather name="edit-2" size={12} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text className="mt-3 text-[20px] font-black text-white">{fullName}</Text>
            <Text className="mt-1 text-[11px] font-semibold text-[#C8C2BA]">Growing stronger every day</Text>
          </Animated.View>
        </LinearGradient>

        <View className="-mt-4 px-5">
          <Animated.View entering={FadeInDown.delay(80).duration(320)} className="flex-row gap-2">
            <StatCard icon="zap" value="18" label="Current Streak" tint="#FF7A00" />
            <StatCard icon="book-open" value={`${Math.round(yearlyGoal * 100)}%`} label="Total Days" tint="#16A34A" />
            <StatCard icon="award" value="312" label="Chapters Read" tint="#3768D8" />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(320)} className="mt-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[15px] font-black text-[#171717]">Achievements</Text>
              <TouchableOpacity activeOpacity={0.78}>
                <Text className="text-[10px] font-bold text-[#7E756B]">View all</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between rounded-[22px] border border-[#EFE7DD] bg-white px-3 py-4">
              <AchievementBadge icon={<Feather name="leaf" size={23} color="#16A34A" />} title="7 Days" subtitle="Starter" tint="#16A34A" />
              <AchievementBadge icon={<FontAwesome5 name="fire" size={22} color="#FF7A00" solid />} title="14 Days" subtitle="Consistent" tint="#FF7A00" />
              <AchievementBadge icon={<FontAwesome5 name="crown" size={21} color="#7257D6" solid />} title="30 Days" subtitle="Dedicated" tint="#7257D6" />
              <AchievementBadge icon={<Feather name="star" size={23} color="#F6B21A" />} title="365 Days" subtitle="Champion" tint="#F6B21A" />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(320)} className="mt-5 overflow-hidden rounded-[22px] border border-[#D8E9D5] bg-[#EAF7E7]">
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-1 pr-4">
                <Text className="text-[12px] font-black text-[#2C4E28]">Monthly Goal</Text>
                <View className="mt-3 flex-row items-end">
                  <Text className="text-[28px] font-black leading-[30px] text-[#1D5B2A]">{monthlyGoalPercent}</Text>
                  <Text className="mb-1 ml-1 text-[13px] font-bold text-[#4E714B]">/30 days</Text>
                </View>
                <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                  <View className="h-full rounded-full bg-[#16A34A]" style={{ width: `${(monthlyGoalPercent / 30) * 100}%` }} />
                </View>
              </View>

              <View className="h-[92px] w-[72px] items-center justify-end">
                <View className="h-12 w-12 rounded-full bg-[#CDECC8]" />
                <View className="-mt-10 h-16 w-9 rounded-b-[16px] rounded-t-[8px] bg-[#A36A2E]" />
                <View className="absolute bottom-11 left-4 h-8 w-5 rotate-[-28deg] rounded-full bg-[#2F9B43]" />
                <View className="absolute bottom-13 right-4 h-9 w-5 rotate-[28deg] rounded-full bg-[#3BB155]" />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(320)} className="mt-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[15px] font-black text-[#171717]">Recent Reflections</Text>
              <TouchableOpacity activeOpacity={0.78}>
                <Text className="text-[10px] font-bold text-[#7E756B]">View all</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {recentReflections.map((activity) => (
                <RecentReflectionRow
                  key={activity.id}
                  icon={activity.type === 'reflection' ? 'edit-3' : 'book-open'}
                  title={activity.title}
                  subtitle={`${activity.date} • ${activity.time}`}
                />
              ))}
              <RecentReflectionRow icon="heart" title={mockProfileAchievements[0]?.title ?? 'Keep Growing'} subtitle="Achievement unlocked recently" />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
