import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PreviewItem = ({ icon, title, subtitle }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; subtitle: string }) => (
  <View className="flex-row items-center rounded-[18px] border border-[#EFE5D8] bg-white px-4 py-3.5">
    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E6]">
      <Feather name={icon} size={17} color="#FF7A00" />
    </View>
    <View className="ml-3 flex-1">
      <Text className="text-[13px] font-black text-[#171717]">{title}</Text>
      <Text className="mt-0.5 text-[11px] font-semibold leading-5 text-[#81776D]">{subtitle}</Text>
    </View>
  </View>
);

const FuturePodium = () => (
  <View className="mt-6 flex-row items-end gap-3">
    {[
      { rank: '2', height: 94, color: '#16A34A' },
      { rank: '1', height: 124, color: '#FF7A00' },
      { rank: '3', height: 78, color: '#3768D8' },
    ].map((item) => (
      <View key={item.rank} className="flex-1 items-center">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <Text className="text-[14px] font-black text-white">#{item.rank}</Text>
        </View>
        <View className="mt-3 w-full rounded-t-[18px]" style={{ height: item.height, backgroundColor: item.color }}>
          <View className="items-center pt-4">
            <FontAwesome5 name={item.rank === '1' ? 'crown' : 'award'} size={18} color="#FFFFFF" solid />
          </View>
        </View>
      </View>
    ))}
  </View>
);

const LeaderboardComingSoonScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#FFFDF9', '#F8F3EB', '#F4EFE6']} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: Math.max(insets.bottom + 116, 136) }}
        className="px-5"
      >
        <Animated.View entering={FadeIn.duration(240)} className="flex-row items-center justify-between">
          <View>
            <Text className="text-[24px] font-black text-[#171717]">Leaderboard</Text>
            <Text className="mt-0.5 text-[11px] font-semibold text-[#81776D]">Upcoming after Bible MVP</Text>
          </View>

          <TouchableOpacity onPress={() => router.replace('/(app)/home')} activeOpacity={0.82} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Feather name="home" size={17} color="#181818" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(70).duration(320)} className="mt-5 overflow-hidden rounded-[28px] bg-[#17191B]">
          <LinearGradient colors={['#242629', '#151719']} className="p-6">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <View className="self-start rounded-full bg-white/10 px-3 py-2">
                  <Text className="text-[10px] font-black uppercase tracking-[0.7px] text-[#FFB56D]">Coming Soon</Text>
                </View>
                <Text className="mt-4 text-[31px] font-black leading-[36px] text-white">Leaderboard will celebrate Bible consistency.</Text>
                <Text className="mt-2 text-[13px] font-semibold leading-6 text-[#CFC8BE]">
                  Rankings will be introduced after reading progress and reflection data are stable enough to make the experience meaningful.
                </Text>
              </View>

              <View className="h-[82px] w-[82px] items-center justify-center rounded-full border-[6px] border-[#FF8A18] bg-[#242628]">
                <FontAwesome5 name="crown" size={27} color="#FFB020" solid />
              </View>
            </View>

            <FuturePodium />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(130).duration(320)} className="mt-5 flex-row gap-3">
          <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
            <Text className="text-[18px] font-black text-[#171717]">Read</Text>
            <Text className="mt-1 text-[9px] font-bold text-[#81776D]">Signal</Text>
          </View>
          <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
            <Text className="text-[18px] font-black text-[#171717]">Reflect</Text>
            <Text className="mt-1 text-[9px] font-bold text-[#81776D]">Signal</Text>
          </View>
          <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
            <Text className="text-[18px] font-black text-[#171717]">Later</Text>
            <Text className="mt-1 text-[9px] font-bold text-[#81776D]">Release</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(320)} className="mt-5 gap-3">
          <PreviewItem icon="book-open" title="Reading-based progress" subtitle="Future standings will be grounded in completed chapters and daily consistency." />
          <PreviewItem icon="edit-3" title="Reflection completion" subtitle="Reflections will help distinguish real engagement from simple point chasing." />
          <PreviewItem icon="users" title="Community encouragement" subtitle="The tone will stay encouraging and discipleship-focused, not pressure-driven." />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(230).duration(320)} className="mt-5 rounded-[22px] border border-[#D8E9D5] bg-[#EAF7E7] p-4">
          <View className="flex-row items-start">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Feather name="target" size={17} color="#16A34A" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-black text-[#1D5B2A]">Current MVP priority</Text>
              <Text className="mt-1 text-[11px] font-semibold leading-5 text-[#4E714B]">
                Build the Bible Journey loop first: choose chapters, read, complete progress, and reflect with clarity.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LeaderboardComingSoonScreen;
