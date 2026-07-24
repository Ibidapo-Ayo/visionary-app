import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface SocialButtonProps {
  icon?: LucideIcon;
  brand?: 'apple' | 'google' | 'facebook';
  layout?: 'icon' | 'full';
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BRAND_LABELS: Record<NonNullable<SocialButtonProps['brand']>, string> = {
  apple: 'A',
  google: 'G',
  facebook: 'f',
};

const BRAND_ICONS: Record<NonNullable<SocialButtonProps['brand']>, React.ComponentProps<typeof FontAwesome5>['name']> = {
  apple: 'apple',
  google: 'google',
  facebook: 'facebook-f',
};

const BRAND_NAMES: Record<NonNullable<SocialButtonProps['brand']>, string> = {
  apple: 'Apple',
  google: 'Google',
  facebook: 'Facebook',
};

const GoogleLogo = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z"
    />
    <Path fill="#FF3D00" d="M6.3 14.7 12.9 19.5C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.2 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
    <Path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.2-5.2C29.1 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
    <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C36.9 39.1 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
  </Svg>
);

const SocialButton = ({ icon: Icon, brand = 'google', layout = 'icon', onPress }: SocialButtonProps) => {
  const fallbackLabel = BRAND_LABELS[brand];
  const brandIcon = BRAND_ICONS[brand];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderIcon = () => {
    if (brand === 'google') {
      return <GoogleLogo size={layout === 'full' ? 22 : 21} />;
    }

    if (Icon) {
      return <Icon size={22} color="#FFFFFF" strokeWidth={2} />;
    }

    if (brandIcon) {
      return <FontAwesome5 name={brandIcon} size={20} color="#FFFFFF" solid={brand === 'facebook'} />;
    }

    return <Text className="text-[20px] font-semibold text-white">{fallbackLabel}</Text>;
  };

  if (layout === 'full') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        className="h-[52px] w-full flex-row items-center justify-center rounded-[12px] bg-white"
        style={[
          animatedStyle,
          {
            borderColor: '#E6E8EC',
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Continue with ${BRAND_NAMES[brand]}`}
      >
        <View className="w-10 items-center justify-center">{renderIcon()}</View>
        <Text className="flex-1 text-center text-[15px] font-semibold text-[#111111]">Continue with Google</Text>
        <View className="w-10" />
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      style={animatedStyle}
      className="h-14 w-14 items-center justify-center rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#121212]"
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${BRAND_NAMES[brand]}`}
    >
      {renderIcon()}
    </AnimatedPressable>
  );
};

export default SocialButton;
