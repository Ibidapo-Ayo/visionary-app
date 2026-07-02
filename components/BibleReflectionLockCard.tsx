import React, { useEffect } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';

interface BibleReflectionLockCardProps {
  completedChapters: number;
  totalChapters: number;
}

const BibleReflectionLockCard = ({ completedChapters, totalChapters }: BibleReflectionLockCardProps) => {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  const progress = totalChapters > 0 ? Math.min(1, completedChapters / totalChapters) : 0;
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 520 });
  }, [progress, progressValue]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0.06, progressValue.value) * 100}%`,
  }));

  return (
    <Card
      animated={false}
      padding="md"
      blurVariant="none"
      style={{
        borderColor: isDark ? '#3C352D' : '#E7D5C2',
        backgroundColor: isDark ? '#181410' : '#FFF6EE',
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Feather name="lock" size={13} color={isDark ? '#FFAF6E' : '#C4651B'} />
            <Text className="text-[11px] font-semibold uppercase tracking-[1px]" style={{ color: isDark ? '#FFCFA5' : '#A14E10' }}>
              Bible Reflection
            </Text>
          </View>

          <Text className="mt-2 text-[12px] leading-5" style={{ color: isDark ? '#E7D5C2' : '#7C5A3C' }}>
            Complete today's assigned reading to unlock your personalized Bible Reflection.
          </Text>
        </View>

        <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: isDark ? '#2A2017' : '#F3DDC8' }}>
          <Feather name="lock" size={15} color={isDark ? '#FFAF6E' : '#C4651B'} />
        </View>
      </View>

      <View className="mt-4">
        <View className="mb-1.5 flex-row items-center justify-between">
          <Text className="text-[11px] font-semibold" style={{ color: isDark ? '#E8D7C3' : '#8A6646' }}>
            Session progress
          </Text>
          <Text className="text-[11px] font-bold" style={{ color: isDark ? '#FFD2A9' : '#B3621B' }}>
            {completedChapters}/{totalChapters}
          </Text>
        </View>

        <View className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: isDark ? '#30251C' : '#F1E2D3' }}>
          <Animated.View className="h-2.5 rounded-full" style={[fillStyle, { backgroundColor: isDark ? '#FF8E3D' : '#D7721F' }]} />
        </View>
      </View>

      <TouchableOpacity
        disabled
        activeOpacity={1}
        className="mt-4 rounded-full border px-4 py-2.5"
        style={{
          borderColor: isDark ? '#45382D' : '#E4CCB4',
          backgroundColor: isDark ? '#221B15' : '#F8EBDD',
          opacity: 0.72,
        }}
      >
        <View className="flex-row items-center justify-center gap-2">
          <Feather name="lock" size={13} color={isDark ? '#EBC49C' : '#A25C1F'} />
          <Text className="text-[12px] font-semibold" style={{ color: isDark ? '#EBC49C' : '#A25C1F' }}>
            Reflect
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default BibleReflectionLockCard;
