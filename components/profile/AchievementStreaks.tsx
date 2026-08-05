import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import Card from '@components/Card';
import type { MockAchievement } from '@/types/index';

interface AchievementStreaksProps {
  isDark: boolean;
  achievements: MockAchievement[];
  onViewAll: () => void;
}

const AchievementStreaks = ({ isDark, achievements, onViewAll }: AchievementStreaksProps) => {
  return (
    <Animated.View entering={FadeIn.delay(120).duration(320)} className="mt-2">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[18px] font-bold" style={{ color: isDark ? '#F6F6F6' : '#1D1914' }}>
          Achievement & Streaks
        </Text>
        <TouchableOpacity onPress={onViewAll} className="flex-row items-center gap-1">
          <Text className="text-[12px] font-semibold" style={{ color: '#FF7A00' }}>
            View All
          </Text>
          <Feather name="arrow-right" size={12} color="#FF7A00" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {achievements.map((achievement, index) => (
          <Animated.View
            key={achievement.id}
            entering={SlideInUp.delay(120 + index * 35).duration(320)}
            style={{ width: '48.5%', marginBottom: 12 }}
          >
            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                borderColor: isDark ? '#2D2D2D' : '#E6DACC',
                backgroundColor: isDark ? 'rgba(17,17,17,0.8)' : 'rgba(255,255,255,0.86)',
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-[19px]">{achievement.badge}</Text>
                <View
                  className="rounded-full border px-2 py-1"
                  style={{
                    borderColor: isDark ? '#2E4E35' : '#BFE4CA',
                    backgroundColor: isDark ? 'rgba(11,34,17,0.8)' : 'rgba(235,252,241,0.95)',
                  }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: isDark ? '#8FE0A6' : '#157A36' }}>
                    +{achievement.spiritualXp} XP
                  </Text>
                </View>
              </View>

              <Text className="mt-2 text-[13px] font-bold" style={{ color: isDark ? '#EFEAE3' : '#34291F' }}>
                {achievement.title}
              </Text>
              <Text className="mt-1 text-[11px]" style={{ color: isDark ? '#AAA49D' : '#7A746D' }}>
                {achievement.unlockedOn}
              </Text>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

export default AchievementStreaks;
