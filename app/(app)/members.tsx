import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Card from '@components/Card';

const MembersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'follow-ups' | 'prayer'>('all');

  const members = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'STEWARD',
      status: 'active',
      lastSeen: '2 hours ago',
      avatar: '👩',
    },
    {
      id: '2',
      name: 'Michael Brown',
      role: 'LEADER',
      status: 'active',
      lastSeen: '1 day ago',
      avatar: '👨',
    },
    {
      id: '3',
      name: 'Emily Davis',
      role: 'MEMBER',
      status: 'inactive',
      lastSeen: '1 week ago',
      avatar: '👩‍🦰',
    },
    {
      id: '4',
      name: 'James Wilson',
      role: 'MEMBER',
      status: 'active',
      lastSeen: '3 hours ago',
      avatar: '👨‍🦱',
    },
  ];

  const followUps = [
    {
      id: '1',
      memberName: 'Emily Davis',
      type: 'inactive',
      dueDate: 'Today',
      priority: 'high',
    },
    {
      id: '2',
      memberName: 'Robert Smith',
      type: 'new_member',
      dueDate: 'Tomorrow',
      priority: 'medium',
    },
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '#ef4444';
      case 'ADMIN':
        return '#f59e0b';
      case 'LEADER':
        return '#6366f1';
      case 'STEWARD':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? '#10b981' : '#64748b';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeIn.duration(400)}>
        <Text style={styles.title}>Members & Follow-ups</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['all', 'follow-ups', 'prayer'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 'all' ? 'All Members' : tab === 'follow-ups' ? 'Follow-ups' : 'Prayer Requests'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'all' && (
          <Animated.View style={styles.content} entering={FadeIn.duration(400)}>
            {filteredMembers.map((member) => (
              <TouchableOpacity key={member.id} activeOpacity={0.7}>
                <Card variant="outlined">
                  <View style={styles.memberCard}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberAvatar}>{member.avatar}</Text>
                      <View style={styles.memberDetails}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberStatus}>
                          {member.status === 'active'
                            ? `Last seen ${member.lastSeen}`
                            : `Inactive - ${member.lastSeen}`}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.memberBadges}>
                      <View
                        style={[
                          styles.roleRole,
                          {
                            backgroundColor: getRoleColor(member.role),
                          },
                        ]}
                      >
                        <Text style={styles.roleBadgeText}>
                          {member.role.split('_')[0]}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusBadgeColor(member.status),
                          },
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>
                          {member.status === 'active' ? '●' : '○'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {selectedTab === 'follow-ups' && (
          <Animated.View style={styles.content} entering={FadeIn.duration(400)}>
            {followUps.map((followUp) => (
              <TouchableOpacity key={followUp.id} activeOpacity={0.7}>
                <Card variant="outlined">
                  <View style={styles.followUpCard}>
                    <View style={styles.followUpInfo}>
                      <Text style={styles.followUpName}>{followUp.memberName}</Text>
                      <Text style={styles.followUpType}>{followUp.type.replace(/_/g, ' ')}</Text>
                    </View>
                    <View style={styles.followUpMeta}>
                      <View
                        style={[
                          styles.priorityBadge,
                          {
                            backgroundColor:
                              followUp.priority === 'high'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            {
                              color:
                                followUp.priority === 'high'
                                  ? '#fca5a5'
                                  : '#fcd34d',
                            },
                          ]}
                        >
                          {followUp.priority}
                        </Text>
                      </View>
                      <Text style={styles.dueDate}>{followUp.dueDate}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {selectedTab === 'prayer' && (
          <Animated.View style={styles.content} entering={FadeIn.duration(400)}>
            <Card variant="outlined">
              <Text style={styles.emptyText}>
                📖 Prayer requests will appear here
              </Text>
            </Card>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomColor: '#2d3a5a',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#64748b',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
  },
  searchIcon: {
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fbbf24',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fbbf24',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  memberAvatar: {
    fontSize: 32,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  memberStatus: {
    fontSize: 12,
    color: '#94a3b8',
  },
  memberBadges: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  roleRole: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 14,
    color: '#fff',
  },
  followUpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followUpInfo: {
    flex: 1,
  },
  followUpName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  followUpType: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  followUpMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 32,
  },
});

export default MembersScreen;
