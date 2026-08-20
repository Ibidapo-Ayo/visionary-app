import React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { ComingSoonCapability } from '@/types/index';

type FeaturePreviewCardProps = {
  title: string;
  capabilities: ComingSoonCapability[];
};

const FeaturePreviewCard = ({ title, capabilities }: FeaturePreviewCardProps) => {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  return (
    <Animated.View
      entering={FadeInDown.delay(260).duration(500)}
      className="rounded-[26px] border px-5 py-5"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.1)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.74)',
      }}
    >
      <Text className="text-[13px] font-semibold uppercase tracking-[0.9px]" style={{ color: isDark ? '#C2C2C2' : '#5A5A5A' }}>
        {title}
      </Text>

      <View className="mt-3 gap-2.5">
        {capabilities.map((capability, index) => (
          <Animated.View
            key={capability.id}
            entering={FadeInDown.delay(330 + index * 65).duration(420)}
            className="flex-row items-center rounded-2xl border px-3 py-2.5"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,17,17,0.08)',
              backgroundColor: isDark ? 'rgba(17,17,17,0.35)' : 'rgba(255,255,255,0.58)',
            }}
          >
            <View
              className="h-8 w-8 items-center justify-center rounded-xl"
              style={{
                backgroundColor: isDark ? 'rgba(255,122,0,0.2)' : 'rgba(255,122,0,0.16)',
              }}
            >
              <Feather name={capability.icon} size={14} color="#FF7A00" />
            </View>
            <Text className="ml-3 flex-1 text-[13px] font-medium" style={{ color: isDark ? '#F0F0F0' : '#181818' }}>
              {capability.label}
            </Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

export default FeaturePreviewCard;
