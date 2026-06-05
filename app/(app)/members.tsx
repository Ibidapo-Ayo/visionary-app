import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import ScreenBackground from '../../components/ScreenBackground';
import { colors, radius, spacing, typography } from '../../lib/theme';
import { mockEvents, mockMembers, MockMember } from '../../services/mockData';

const statusFilters = ['all', 'new', 'active', 'at-risk', 'inactive'] as const;

const MembersScreen = () => {
  const [mode, setMode] = useState<'events' | 'people'>('events');
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>('all');

  const filteredMembers = useMemo(
    () => (filter === 'all' ? mockMembers : mockMembers.filter((member: MockMember) => member.status === filter)),
    [filter]
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text style={styles.title}>Community Discovery</Text>
          <Text style={styles.subtitle}>Find gatherings, connect deeply, and track engagement in one flow.</Text>
        </Animated.View>

        <View style={styles.modeRow}>
          {(['events', 'people'] as const).map((value) => (
            <TouchableOpacity key={value} style={[styles.modeButton, mode === value && styles.modeButtonActive]} onPress={() => setMode(value)}>
              <Text style={[styles.modeText, mode === value && styles.modeTextActive]}>{value === 'events' ? 'Events' : 'People'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'events' ? (
          <FlatList
            data={mockEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Card padding="lg" blurVariant="strong" style={styles.listItem}>
                <View style={styles.eventBanner}>
                  <Feather name="calendar" size={16} color={colors.primaryStrong} />
                  <Text style={styles.eventChip}>Featured Experience</Text>
                </View>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventMeta}>{item.time} • {item.location}</Text>
                <View style={styles.eventActionRow}>
                  <Badge label="Register" variant="info" />
                  <Feather name="arrow-right" size={18} color={colors.textSecondary} />
                </View>
              </Card>
            )}
          />
        ) : (
          <>
            <View style={styles.filterRow}>
              {statusFilters.map((status) => (
                <TouchableOpacity key={status} style={[styles.filterChip, filter === status && styles.filterChipActive]} onPress={() => setFilter(status)}>
                  <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>{status === 'all' ? 'All' : status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredMembers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Card padding="md" blurVariant="soft" style={styles.listItem}>
                  <View style={styles.memberRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.memberMeta}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberEmail}>{item.email}</Text>
                    </View>
                    <Badge label={item.status} variant={item.status === 'new' ? 'new' : item.status === 'at-risk' ? 'at-risk' : item.status === 'active' ? 'success' : 'default'} />
                  </View>
                </Card>
              )}
            />
          </>
        )}
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  modeRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: spacing.md,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255,122,26,0.28)',
  },
  modeText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modeTextActive: {
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: 'rgba(53,208,127,0.22)',
    borderColor: 'rgba(53,208,127,0.45)',
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: 140,
  },
  listItem: {
    marginBottom: spacing.sm,
  },
  eventBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventChip: {
    color: colors.primaryStrong,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  eventTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  eventMeta: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
    marginTop: 2,
  },
  eventActionRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,122,26,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  memberMeta: {
    flex: 1,
  },
  memberName: {
    color: colors.textPrimary,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  memberEmail: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
});

export default MembersScreen;
