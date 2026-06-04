import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      onPress,
      title,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      style,
      textStyle,
      fullWidth = false,
      icon,
    },
    ref
  ) => {
    const buttonStyle = [
      styles.button,
      styles[`button_${variant}`],
      styles[`button_${size}`],
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
      style,
    ];

    const textSizeStyle = styles[`text_${size}`];

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={buttonStyle}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? '#fff' : '#fbbf24'}
            size={size === 'sm' ? 'small' : 'large'}
          />
        ) : (
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: icon ? 8 : 0,
            }}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {icon}
            <Text style={[styles.text, textSizeStyle, textStyle]}>
              {title}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_primary: {
    backgroundColor: '#fbbf24',
  },
  button_secondary: {
    backgroundColor: '#10b981',
  },
  button_tertiary: {
    backgroundColor: '#64748b',
  },
  button_danger: {
    backgroundColor: '#ef4444',
  },
  button_sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button_md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button_lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  text: {
    fontWeight: '600',
    color: '#fff',
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
