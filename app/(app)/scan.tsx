import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RolloutItem = ({ icon, title, subtitle }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; subtitle: string }) => (
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

const QRPreview = () => (
  <View className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4">
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-[11px] font-black uppercase tracking-[0.7px] text-[#FFB56D]">Preview</Text>
        <Text className="mt-1 text-[15px] font-black text-white">Future QR check-in</Text>
      </View>
      <View className="rounded-full bg-white/10 px-3 py-2">
        <Text className="text-[10px] font-black text-[#CFC8BE]">Disabled</Text>
      </View>
    </View>

    <View className="mt-4 items-center rounded-[22px] bg-[#111315] py-6">
      <View className="h-[150px] w-[150px] items-center justify-center rounded-[26px] border-[3px] border-[#FF7A00] bg-[#202225]">
        <View className="flex-row flex-wrap gap-2 px-6">
          {Array.from({ length: 16 }).map((_, index) => (
            <View
              key={`qr-dot-${index}`}
              className="h-5 w-5 rounded-[5px]"
              style={{ backgroundColor: index % 3 === 0 ? '#FF7A00' : index % 2 === 0 ? '#FFFFFF' : '#3D3F42' }}
            />
          ))}
        </View>
      </View>
    </View>
  </View>
);

const ScanComingSoonScreen = () => {
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
            <Text className="text-[24px] font-black text-[#171717]">Attendance</Text>
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
                <Text className="mt-4 text-[31px] font-black leading-[36px] text-white">Attendance will launch with QR check-in.</Text>
                <Text className="mt-2 text-[13px] font-semibold leading-6 text-[#CFC8BE]">
                  This module is intentionally parked while the MVP focuses on Bible reading, chapter progress, and reflections.
                </Text>
              </View>

              <View className="h-[82px] w-[82px] items-center justify-center rounded-full border-[6px] border-[#FF8A18] bg-[#242628]">
                <Feather name="camera" size={28} color="#FF7A00" />
              </View>
            </View>

            <QRPreview />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(130).duration(320)} className="mt-5 flex-row gap-3">
          <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
            <Text className="text-[18px] font-black text-[#171717]">1 tap</Text>
            <Text className="mt-1 text-[9px] font-bold text-[#81776D]">Target Check-in</Text>
          </View>
          <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
            <Text className="text-[18px] font-black text-[#171717]">QR</Text>
            <Text className="mt-1 text-[9px] font-bold text-[#81776D]">Validation Mode</Text>
          </View>
          <View className="flex-1 rounded-[18px] border border-[#EFE5D8] bg-white px-3 py-3">
            <Text className="text-[18px] font-black text-[#171717]">Later</Text>
            <Text className="mt-1 text-[9px] font-bold text-[#81776D]">Release Phase</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(320)} className="mt-5 gap-3">
          <RolloutItem icon="camera" title="QR scan experience" subtitle="A fast scanner for event entrance check-in will come after the reading MVP." />
          <RolloutItem icon="shield" title="Verified attendance records" subtitle="Check-ins will be tied to real gatherings and member profiles." />
          <RolloutItem icon="bar-chart-2" title="History and insights" subtitle="Future views will show attendance streaks without crowding the MVP." />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(230).duration(320)} className="mt-5 rounded-[22px] border border-[#D8E9D5] bg-[#EAF7E7] p-4">
          <View className="flex-row items-start">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Feather name="book-open" size={17} color="#16A34A" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-black text-[#1D5B2A]">Current MVP priority</Text>
              <Text className="mt-1 text-[11px] font-semibold leading-5 text-[#4E714B]">
                Bible Journey remains the primary experience: daily readings, selectable chapters, progress, and reflection tracking.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ScanComingSoonScreen;
