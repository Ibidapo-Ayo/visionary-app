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
  badge_new: { backgroundColor: 'rgba(82,210,198,0.16)', borderColor: 'rgba(82,210,198,0.35)' },
  label_new: { color: colors.accentTeal },
  'badge_at-risk': { backgroundColor: 'rgba(241,154,99,0.18)', borderColor: 'rgba(241,154,99,0.35)' },
  'label_at-risk': { color: colors.accentAmber },
  badge_success: { backgroundColor: 'rgba(94,226,185,0.18)', borderColor: 'rgba(94,226,185,0.4)' },
  label_success: { color: colors.success },
  badge_info: { backgroundColor: 'rgba(121,168,255,0.18)', borderColor: 'rgba(121,168,255,0.4)' },
  label_info: { color: colors.primary },
  badge_primary: { backgroundColor: 'rgba(248,198,109,0.18)', borderColor: 'rgba(248,198,109,0.4)' },
  label_primary: { color: colors.accentGold },
});

export default Badge;
