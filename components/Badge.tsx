import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'new' | 'at-risk' | 'success' | 'info' | 'primary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const Badge = ({ label, variant = 'default', style }: BadgeProps) => {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], style]}>
      <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  badge_default: {
    backgroundColor: '#1a1f3a',
    borderColor: '#64748b',
  },
  label_default: {
    color: '#cbd5e1',
  },

  badge_new: {
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: '#60a5fa',
  },
  label_new: {
    color: '#93c5fd',
  },

  'badge_at-risk': {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderColor: '#fbbf24',
  },
  'label_at-risk': {
    color: '#fde68a',
  },

  badge_success: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: '#34d399',
  },
  label_success: {
    color: '#6ee7b7',
  },

  badge_info: {
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: '#60a5fa',
  },
  label_info: {
    color: '#93c5fd',
  },

  badge_primary: {
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    borderColor: '#fbbf24',
  },
  label_primary: {
    color: '#fef3c7',
  },
});

export default Badge;
