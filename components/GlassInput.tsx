import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../lib/theme';

interface GlassInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightNode?: React.ReactNode;
}

const GlassInput = ({ label, error, containerStyle, rightNode, ...props }: GlassInputProps) => {
  return (
    <View style={[styles.group, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputShell, error && styles.inputShellError]}>
        <TextInput
          {...props}
          style={[styles.input, props.style]}
          placeholderTextColor={colors.textMuted}
        />
        {rightNode}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  inputShell: {
    borderRadius: radius.md,
    borderColor: colors.borderSoft,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputShellError: {
    borderColor: 'rgba(255,127,147,0.55)',
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
});

export default GlassInput;
