import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  blurVariant?: 'none' | 'soft' | 'strong';
}

const cardVariantClass: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'border-[#E5EEE8]',
  outlined: 'border-[#D5E1D8] bg-transparent',
  elevated: 'border-[rgba(10,147,54,0.24)]',
};

const paddingClass: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3.5',
  md: 'p-[18px]',
  lg: 'p-7',
};

const blurClass: Record<NonNullable<CardProps['blurVariant']>, string> = {
  none: 'bg-white',
  soft: 'bg-[rgba(255,255,255,0.92)]',
  strong: 'bg-white',
};

const Card = React.forwardRef<View, CardProps>(
  (
    {
      children,
      style,
      onPress,
      variant = 'default',
      padding = 'md',
      animated = true,
      blurVariant = 'soft',
    },
    ref
  ) => {
    const Component = onPress ? TouchableOpacity : View;

    return (
      <Animated.View ref={ref as any} entering={animated ? FadeIn.duration(240) : undefined}>
        <Component
          className={`rounded-3xl border ${cardVariantClass[variant]} ${paddingClass[padding]} ${blurClass[blurVariant]}`}
          style={style}
          onPress={onPress}
          activeOpacity={onPress ? 0.9 : 1}
        >
          {children}
        </Component>
      </Animated.View>
    );
  }
);

Card.displayName = 'Card';

export default Card;
