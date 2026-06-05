import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../lib/theme';

type BadgeVariant = 'default' | 'new' | 'at-risk' | 'success' | 'info' | 'primary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const Badge = ({ label, variant = 'default', style }: BadgeProps) => (
  <View style={[styles.badge, styles[`badge_${variant}`], style]}>
    <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  badge_default: { backgroundColor: colors.surfaceMuted, borderColor: colors.borderSoft },
  label_default: { color: colors.textSecondary },
  badge_new: { backgroundColor: 'rgba(53,208,127,0.18)', borderColor: 'rgba(53,208,127,0.4)' },
  label_new: { color: colors.accentGreen },
  'badge_at-risk': { backgroundColor: 'rgba(255,110,98,0.2)', borderColor: 'rgba(255,110,98,0.45)' },
  'label_at-risk': { color: colors.danger },
  badge_success: { backgroundColor: 'rgba(53,208,127,0.2)', borderColor: 'rgba(53,208,127,0.4)' },
  label_success: { color: colors.success },
  badge_info: { backgroundColor: 'rgba(255,122,26,0.2)', borderColor: 'rgba(255,122,26,0.46)' },
  label_info: { color: colors.primaryStrong },
  badge_primary: { backgroundColor: 'rgba(255,122,26,0.18)', borderColor: 'rgba(255,122,26,0.4)' },
  label_primary: { color: colors.primary },
});

export default Badge;
