import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, shadows, spacing, typography } from '../lib/theme';

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

const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
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
    const sizeStyle = styles[`button_${size}`];
    const labelSizeStyle = styles[`label_${size}`];

    const content = (
      <View style={styles.content}>
        {icon}
        <Text style={[styles.label, styles[`label_${variant}`], labelSizeStyle, textStyle]}>{title}</Text>
      </View>
    );

    const isGradient = variant === 'primary';

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.88}
        style={[
          styles.base,
          styles[`button_${variant}`],
          sizeStyle,
          fullWidth && styles.fullWidth,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#1A120B' : colors.textPrimary} />
        ) : isGradient ? (
          <LinearGradient colors={gradients.cta} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            {content}
          </LinearGradient>
        ) : (
          content
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  label_primary: {
    color: '#1A120B',
  },
  label_secondary: {
    color: colors.textPrimary,
  },
  label_tertiary: {
    color: colors.textSecondary,
  },
  label_danger: {
    color: '#FFEFEB',
  },
  button_primary: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,122,26,0.55)',
    ...shadows.glow,
  },
  button_secondary: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
  },
  button_tertiary: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderSoft,
  },
  button_danger: {
    backgroundColor: 'rgba(255,110,98,0.2)',
    borderColor: 'rgba(255,110,98,0.45)',
  },
  button_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  button_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  button_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  label_sm: {
    fontSize: typography.bodySm.fontSize,
  },
  label_md: {
    fontSize: typography.body.fontSize,
  },
  label_lg: {
    fontSize: typography.h3.fontSize,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
