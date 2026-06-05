import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
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
    },
    ref
  ) => {
    const containerStyle = [
      styles.card,
      styles[`card_${variant}`],
      styles[`padding_${padding}`],
      style,
    ];

    const Component = onPress ? TouchableOpacity : View;

    return (
      <Animated.View
        ref={ref as any}
        entering={animated ? FadeIn.duration(300) : undefined}
      >
        <Component
          style={containerStyle}
          onPress={onPress}
          activeOpacity={onPress ? 0.7 : 1}
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
    borderRadius: 12,
    marginVertical: 8,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: 12,
  },
  padding_md: {
    padding: 16,
  },
  padding_lg: {
    padding: 20,
  },
  card_default: {
    backgroundColor: '#1a1f3a',
    borderColor: '#2d3a5a',
    borderWidth: 1,
  },
  card_outlined: {
    backgroundColor: 'transparent',
    borderColor: '#64748b',
    borderWidth: 1,
  },
  card_elevated: {
    backgroundColor: '#1a1f3a',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});

export default Card;
