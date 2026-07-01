import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, radius, shadows, spacing } from '../lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  blurVariant?: 'none' | 'soft' | 'strong';
}

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
          style={[
            styles.card,
            styles[`card_${variant}`],
            styles[`padding_${padding}`],
            styles[`blur_${blurVariant}`],
            style,
          ]}
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

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  padding_none: { padding: 0 },
  padding_sm: { padding: spacing.sm },
  padding_md: { padding: spacing.md },
  padding_lg: { padding: spacing.lg },
  blur_none: {
    backgroundColor: colors.backgroundElevated,
  },
  blur_soft: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  blur_strong: {
    backgroundColor: '#FFFFFF',
  },
  card_default: {
    borderColor: colors.borderSoft,
    ...shadows.soft,
  },
  card_outlined: {
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  card_elevated: {
    borderColor: 'rgba(10,147,54,0.24)',
    ...shadows.strong,
  },
});

export default Card;
