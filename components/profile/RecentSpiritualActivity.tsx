import React from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import Card from '@components/Card';
import type { MockSpiritualActivity } from '@/types/index';

interface RecentSpiritualActivityProps {
  isDark: boolean;
  activities: MockSpiritualActivity[];
}

const iconByType: Record<MockSpiritualActivity['type'], React.ComponentProps<typeof Feather>['name']> = {
  bibleReading: 'book-open',
  reflection: 'edit-2',
  attendance: 'check-circle',
  digest: 'bookmark',
  prayer: 'heart',
};

const RecentSpiritualActivity = ({ isDark, activities }: RecentSpiritualActivityProps) => {
  return (
    <Animated.View entering={FadeIn.delay(180).duration(320)} className="mt-2">
      <Text className="mb-3 text-[18px] font-bold" style={{ color: isDark ? '#F6F6F6' : '#1D1914' }}>
        Recent Spiritual Activity
      </Text>

      <Card
        animated={false}
        padding="md"
        blurVariant="none"
        style={{
          borderColor: isDark ? '#2D2D2D' : '#E9DFD4',
          backgroundColor: isDark ? 'rgba(16,16,16,0.84)' : 'rgba(255,255,255,0.86)',
        }}
      >
        {activities.map((activity, index) => (
          <Animated.View key={activity.id} entering={SlideInUp.delay(180 + index * 35).duration(300)}>
            <View className="flex-row items-start gap-3">
              <View className="items-center pt-0.5">
                <View
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,122,0,0.14)' : 'rgba(255,122,0,0.18)',
                  }}
                >
                  <Feather name={iconByType[activity.type]} size={15} color="#FF7A00" />
                </View>
                {index < activities.length - 1 ? (
                  <View
                    className="mt-1 h-9 w-[1.5px]"
                    style={{ backgroundColor: isDark ? '#343434' : '#E2D7CB' }}
                  />
                ) : null}
              </View>

              <View className="flex-1 pb-3.5">
                <Text className="text-[13px] font-semibold" style={{ color: isDark ? '#F2ECE6' : '#2F241A' }}>
                  {activity.title}
                </Text>
                <Text className="mt-1 text-[11px]" style={{ color: isDark ? '#A8A19A' : '#7E7A74' }}>
                  {activity.date} • {activity.time}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </Card>
    </Animated.View>
  );
};

export default RecentSpiritualActivity;
