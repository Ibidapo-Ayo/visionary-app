import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../utils/colors';
import { spacing, typography } from '../../utils/spacing';
import { mockMembers } from '../../services/api/mockData';

const MembersScreen = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'at-risk', label: 'At-Risk' },
    { id: 'inactive', label: 'Inactive' },
  ];

  const filteredMembers =
    selectedTab === 'all' ? mockMembers : mockMembers.filter((m) => m.status === selectedTab);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'new';
      case 'at-risk':
        return 'at-risk';
      case 'active':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
        <Text style={styles.count}>{filteredMembers.length} members</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                selectedTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Members list */}
      <FlatList
        data={filteredMembers}
        renderItem={({ item }) => (
          <Card padding="md" style={styles.memberCard}>
            <View style={styles.memberContent}>
              <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberEmail}>{item.email}</Text>
                </View>
              </View>
              <Badge label={item.status} variant={getStatusVariant(item.status)} />
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.heading.h1.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  count: {
    fontSize: typography.body.small.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: typography.caption.large.fontSize,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabLabel: {
    color: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  memberCard: {
    marginBottom: spacing.md,
  },
  memberContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: '700',
    color: colors.background,
  },
  details: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  memberEmail: {
    fontSize: typography.body.small.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default MembersScreen;
