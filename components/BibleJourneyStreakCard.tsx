import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import Card from '@components/Card';
import StreakProgressRing from '@components/StreakProgressRing';

interface BibleJourneyStreakCardProps {
  morningCompleted: boolean;
  eveningCompleted: boolean;
  dailyCompleted: boolean;
  currentStreak: number;
  longestStreak: number;
}

const BibleJourneyStreakCard = ({
  morningCompleted,
  eveningCompleted,
  dailyCompleted,
  currentStreak,
  longestStreak,
}: BibleJourneyStreakCardProps) => {
  const morningProgress = morningCompleted ? 1 : 0.26;
  const eveningProgress = eveningCompleted ? 1 : 0.18;
  const dailyProgress = dailyCompleted ? 1 : (morningCompleted ? 0.52 : 0.08) + (eveningCompleted ? 0.48 : 0);

  const streakTitle = useMemo(() => {
    if (currentStreak >= 30) {
      return 'Consistent In The Word';
    }

    if (currentStreak >= 7) {
      return 'Steady And Growing';
    }

    if (currentStreak >= 1) {
      return 'Streak Ignited';
    }

    return 'Light The Flame Today';
  }, [currentStreak]);

  const badges = [
    { id: 'spark', label: 'Spark', unlocked: currentStreak >= 1, color: '#FF8E3A' },
    { id: 'steady', label: 'Steady 7', unlocked: currentStreak >= 7, color: '#FFB25B' },
    { id: 'faithful', label: 'Faithful 30', unlocked: currentStreak >= 30, color: '#FDD58A' },
  ];

  return (
    <Card
      animated={false}
      padding="none"
      blurVariant="none"
      style={{
        borderColor: '#2D2D2D',
        backgroundColor: 'rgba(17,17,17,0.66)',
      }}
    >
      <LinearGradient
        colors={['rgba(255,122,0,0.18)', 'rgba(16,16,16,0.82)', 'rgba(12,18,14,0.88)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-[24px] border border-[#3A332A] px-4 py-4"
      >
        <Animated.View entering={FadeIn.duration(280)} className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#D3B494]">Bible Journey Streak</Text>
            <Text className="mt-1 text-[20px] font-extrabold text-[#FAF6F1]">{streakTitle}</Text>
            <Text className="mt-1 text-[11px] text-[#C9B8A7]">Build a rhythm of morning and evening scripture each day.</Text>
          </View>

          <View className="rounded-2xl border border-[#5A4332] bg-[#20160F] px-3 py-2">
            <View className="flex-row items-center gap-1.5">
              <Feather name="flame" size={14} color="#FF9D47" />
              <Text className="text-[18px] font-black text-[#FFE0BF]">{currentStreak}</Text>
            </View>
            <Text className="mt-0.5 text-[10px] font-semibold text-[#D9B894]">Day Streak</Text>
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(60).duration(320)} className="mt-4 flex-row items-center justify-between">
          <StreakProgressRing progress={morningProgress} label="Morning" valueText={morningCompleted ? 'Done' : 'Open'} color="#FF8D34" />
          <StreakProgressRing progress={eveningProgress} label="Evening" valueText={eveningCompleted ? 'Done' : 'Open'} color="#7FA0FF" />
          <StreakProgressRing progress={dailyProgress} label="Today" valueText={dailyCompleted ? '100%' : `${Math.round(dailyProgress * 100)}%`} color="#16A34A" />
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(110).duration(320)} className="mt-4 rounded-2xl border border-[#2F2F2F] bg-[rgba(16,16,16,0.62)] px-3 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#1D2A1F]">
                <Feather name="zap" size={14} color="#9CE1B0" />
              </View>
              <View>
                <Text className="text-[12px] font-semibold text-[#EAF4EE]">Longest Streak</Text>
                <Text className="text-[11px] text-[#A8C9B2]">Your best consistency window</Text>
              </View>
            </View>
            <Text className="text-[20px] font-black text-[#B9EBC7]">{longestStreak}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(150).duration(320)} className="mt-4 flex-row justify-between">
          {badges.map((badge) => (
            <View
              key={badge.id}
              className={`w-[31.5%] rounded-2xl border px-2 py-2.5 ${badge.unlocked ? 'border-[#4B3A2A] bg-[#23180F]' : 'border-[#2D2D2D] bg-[#161616]'}`}
            >
              <View className="flex-row items-center gap-1.5">
                <Feather name="award" size={12} color={badge.unlocked ? badge.color : '#6B6B6B'} />
                <Text className={`text-[11px] font-semibold ${badge.unlocked ? 'text-[#FFD7AF]' : 'text-[#8A8A8A]'}`}>{badge.label}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </LinearGradient>
    </Card>
  );
};

export default BibleJourneyStreakCard;
