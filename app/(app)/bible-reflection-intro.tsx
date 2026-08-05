import React from 'react';
import { StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import { mockBibleJourneySessionPlan } from '@services/mockData';
import type { ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

const BibleReflectionIntroScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  const params = useLocalSearchParams<{ period?: string }>();

  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';
  const isReflectionCompleteForToday = useBibleJourneyStore((state) => state.isReflectionCompleteForToday);

  const reflectionDone = isReflectionCompleteForToday(period);
  const assignedReferences = period === 'morning' ? mockBibleJourneySessionPlan.morning : mockBibleJourneySessionPlan.evening;

  const gradient = isDark
    ? (['#060606', '#0A0A09', '#10110F'] as const)
    : (['#F8F4EE', '#F4EEE6', '#F0EADF'] as const);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/bible-journey');
  };

  const startReflection = () => {
    router.replace({
      pathname: '/(app)/bible-reading-reflection',
      params: {
        period,
        reference: assignedReferences[assignedReferences.length - 1],
      },
    });
  };

  return (
    <LinearGradient colors={gradient} className="flex-1 px-5">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View className="pb-3 pt-8">
        <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor: isDark ? '#2D2D2D' : '#DECDBB',
              backgroundColor: isDark ? '#151515' : '#FFF4E7',
            }}
            onPress={handleBack}
          >
            <Feather name="chevron-left" size={18} color={isDark ? '#F4F4F4' : '#403124'} />
          </TouchableOpacity>

          <Text className="text-[16px] font-semibold" style={{ color: isDark ? '#F2F2F2' : '#2E251D' }}>Bible Reflection</Text>

          <View className="h-10 w-10" />
        </Animated.View>
      </View>

      <Animated.View entering={SlideInUp.duration(260)} className="mt-4">
        <Card
          animated={false}
          padding="md"
          blurVariant="none"
          style={{
            borderColor: isDark ? '#2C2C2C' : '#E2D5C5',
            backgroundColor: isDark ? '#141414' : '#FFF8EF',
          }}
        >
          <Text className="text-[11px] font-semibold uppercase tracking-[1px]" style={{ color: isDark ? '#A7A7A7' : '#7E6B59' }}>
            {period === 'morning' ? 'Morning Session Completed' : 'Evening Session Completed'}
          </Text>
          <Text className="mt-2 text-[24px] font-bold" style={{ color: isDark ? '#F3F3F3' : '#2F2419' }}>
            Pause and Reflect
          </Text>
          <Text className="mt-2 text-[13px] leading-6" style={{ color: isDark ? '#C9C9C9' : '#6F5B48' }}>
            You have completed all assigned chapters. Take a quiet moment to reflect on what God is saying through today&apos;s reading.
          </Text>

          <View className="mt-3 rounded-2xl border px-3 py-2.5" style={{ borderColor: isDark ? '#2F2F2F' : '#E7D9C8', backgroundColor: isDark ? '#1A1A1A' : '#FFF4E7' }}>
            <Text className="text-[11px]" style={{ color: isDark ? '#B4B4B4' : '#7E6B59' }}>
              {assignedReferences.join(' • ')}
            </Text>
          </View>

          <TouchableOpacity
            className={`mt-4 rounded-full px-4 py-3 ${reflectionDone ? 'bg-[#1A3521]' : 'bg-[#FF7A00]'}`}
            onPress={startReflection}
          >
            <Text className={`text-center text-[12px] font-semibold ${reflectionDone ? 'text-[#DDF3E3]' : 'text-[#1B1309]'}`}>
              {reflectionDone ? 'Open Reflection Again' : 'Start Bible Reflection'}
            </Text>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    </LinearGradient>
  );
};

export default BibleReflectionIntroScreen;
