import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import Card from '@components/Card';
import type { MockSpiritualMetric } from '@/types/index';

interface SpiritualProgressOverviewProps {
  isDark: boolean;
  metrics: MockSpiritualMetric[];
}

const iconByMetric: Record<MockSpiritualMetric['iconKey'], React.ComponentProps<typeof Feather>['name']> = {
  bibleJourney: 'book-open',
  bibleReadingStreak: 'sun',
  prayerStreak: 'heart',
  attendanceStreak: 'check-circle',
  digestStreak: 'bookmark',
  overallJourney: 'target',
};

const MiniProgressRing = ({ progress, color, isDark }: { progress: number; color: string; isDark: boolean }) => {
  const size = 42;
  const strokeWidth = 5;
  const normalized = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - normalized);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
        <Text className="text-[10px] font-bold" style={{ color: isDark ? '#F7F7F7' : '#2B241D' }}>
          {Math.round(normalized * 100)}%
        </Text>
      </View>
    </View>
  );
};

const SpiritualProgressOverview = ({ isDark, metrics }: SpiritualProgressOverviewProps) => {
  return (
    <Animated.View entering={FadeIn.delay(60).duration(320)}>
      <Text className="mb-3 text-[18px] font-bold" style={{ color: isDark ? '#F6F6F6' : '#1D1914' }}>
        Spiritual Progress Overview
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {metrics.map((metric, index) => (
          <Animated.View
            key={metric.id}
            entering={SlideInUp.delay(70 + index * 30).duration(360)}
            style={{ width: '48.5%', marginBottom: 12 }}
          >
            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                borderColor: isDark ? '#2E2E2E' : '#E9DFD4',
                backgroundColor: isDark ? 'rgba(16,16,16,0.8)' : 'rgba(255,255,255,0.82)',
              }}
            >
              <View className="flex-row items-start justify-between">
                <View
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,122,0,0.16)' : 'rgba(255,122,0,0.18)',
                  }}
                >
                  <Feather name={iconByMetric[metric.iconKey]} size={16} color={metric.color} />
                </View>
                <MiniProgressRing progress={metric.progress} color={metric.color} isDark={isDark} />
              </View>

              <Text className="mt-3 text-[12px] font-semibold" style={{ color: isDark ? '#E7E1DA' : '#4A3A2B' }}>
                {metric.title}
              </Text>
              <Text className="mt-1 text-[16px] font-extrabold" style={{ color: isDark ? '#F9F9F9' : '#1E1A16' }}>
                {metric.currentValue}
              </Text>
              <Text className="mt-1 text-[11px]" style={{ color: isDark ? '#A3A3A3' : '#7A7A7A' }}>
                {metric.currentStreak}
              </Text>
              <Text className="mt-1 text-[11px]" style={{ color: isDark ? '#CBBAA8' : '#8A6B4C' }}>
                {metric.encouragement}
              </Text>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

export default SpiritualProgressOverview;
