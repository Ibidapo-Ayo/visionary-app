import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { ComingSoonScreenProps } from '@/types/index';
import ComingSoonHeroIllustration from './ComingSoonHeroIllustration';
import FeaturePreviewCard from './FeaturePreviewCard';

type ScaleButtonProps = {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
  icon?: React.ComponentProps<typeof Feather>['name'];
};

const ScaleButton = ({ label, onPress, variant, icon }: ScaleButtonProps) => {
  const scale = useSharedValue(1);
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 18, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 200 });
        }}
        className="h-[54px] flex-row items-center justify-center rounded-[18px] border px-4"
        style={
          variant === 'primary'
            ? {
                borderColor: 'rgba(255,122,0,0.56)',
                backgroundColor: '#FF7A00',
              }
            : {
                borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(17,17,17,0.12)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
              }
        }
      >
        {icon ? <Feather name={icon} size={16} color={variant === 'primary' ? '#131313' : '#FF7A00'} /> : null}
        <Text
          className={`text-[15px] font-semibold ${icon ? 'ml-2' : ''}`}
          style={{ color: variant === 'primary' ? '#131313' : isDark ? '#F4F4F4' : '#1A1A1A' }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const ComingSoonScreen = ({
  title,
  description,
  capabilityTitle,
  capabilities,
  primaryButtonLabel,
  secondaryButtonLabel,
  successMessage,
  onPrimaryAction,
  onSecondaryAction,
}: ComingSoonScreenProps) => {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  const insets = useSafeAreaInsets();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePrimaryAction = () => {
    onPrimaryAction?.();

    if (successMessage) {
      setFeedback(successMessage);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#070707', '#111111', '#151515'] : ['#FFF7F0', '#FFFDFC', '#F8F8F8']}
      className="flex-1"
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View
        className="absolute -right-24 top-12 h-56 w-56 rounded-full"
        style={{ backgroundColor: isDark ? 'rgba(255,122,0,0.17)' : 'rgba(255,122,0,0.15)' }}
      />
      <View
        className="absolute -left-20 top-52 h-52 w-52 rounded-full"
        style={{ backgroundColor: isDark ? 'rgba(22,163,74,0.16)' : 'rgba(22,163,74,0.12)' }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-5"
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom + 20, 42) }}
      >
        <Animated.View entering={FadeInDown.duration(420)}>
          <View
            className="self-start rounded-full border px-3 py-1"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(17,17,17,0.1)',
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.62)',
            }}
          >
            <Text className="text-[11px] font-semibold uppercase tracking-[0.9px]" style={{ color: '#FF7A00' }}>
              Flagship Feature in Progress
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(120).duration(420)} className="mt-4">
          <ComingSoonHeroIllustration />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(500)} className="mt-1">
          <Text className="text-[31px] font-black leading-[38px]" style={{ color: isDark ? '#FFFFFF' : '#111111' }}>
            {title}
          </Text>
          <Text className="mt-3 text-[14px] leading-6" style={{ color: isDark ? '#D1D1D1' : '#3A3A3A' }}>
            {description}
          </Text>
        </Animated.View>

        <View className="mt-6">
          <FeaturePreviewCard title={capabilityTitle} capabilities={capabilities} />
        </View>

        <Animated.View entering={FadeInDown.delay(520).duration(420)} className="mt-5 gap-3">
          <ScaleButton label={primaryButtonLabel} onPress={handlePrimaryAction} variant="primary" icon="bell" />
          <ScaleButton label={secondaryButtonLabel} onPress={onSecondaryAction} variant="secondary" icon="arrow-left" />
        </Animated.View>

        {feedback ? (
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="mt-4 flex-row items-center rounded-2xl border px-4 py-3"
            style={{
              borderColor: isDark ? 'rgba(22,163,74,0.42)' : 'rgba(22,163,74,0.4)',
              backgroundColor: isDark ? 'rgba(22,163,74,0.16)' : 'rgba(22,163,74,0.12)',
            }}
          >
            <View className="h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(22,163,74,0.2)' }}>
              <Feather name="check" size={14} color="#16A34A" />
            </View>
            <Text className="ml-2.5 flex-1 text-[13px] leading-5" style={{ color: isDark ? '#DDF8E5' : '#0C5A29' }}>
              {feedback}
            </Text>
          </Animated.View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
};

export default ComingSoonScreen;
