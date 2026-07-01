import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import Badge from '@components/Badge';
import ScreenBackground from '@components/ScreenBackground';
import { colors } from '../../lib/theme';
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
      <View className="flex-1 px-7 pb-[18px] pt-9">
        <Animated.View entering={FadeIn.duration(280)} className="mb-[18px] mt-[18px]">
          <Text className="text-[34px] font-extrabold leading-[42px] text-black">Community</Text>
          <Text className="text-[14px] text-[#718078]">Events and people in one clean workspace.</Text>
        </Animated.View>

        <View className="mb-[18px] flex-row rounded-[18px] border border-[#E5EEE8] bg-[#EAF3ED] p-1">
          {(['events', 'people'] as const).map((value) => (
            <TouchableOpacity key={value} className={`flex-1 items-center rounded-[14px] py-2 ${mode === value ? 'bg-[#D85A16]' : ''}`} onPress={() => setMode(value)}>
              <Text className={`text-[14px] font-bold ${mode === value ? 'text-white' : 'text-[#718078]'}`}>{value === 'events' ? 'Events' : 'People'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'events' ? (
          <FlatList
            data={mockEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 140 }}
            renderItem={({ item }) => (
              <Card padding="md" blurVariant="strong" style={{ marginBottom: 14 }}>
                <View className="mb-[14px] flex-row items-center justify-between">
                  <Badge label="Featured" variant="primary" />
                  <Feather name="arrow-up-right" size={15} color={colors.accentOrange} />
                </View>
                <Text className="text-[20px] font-bold leading-7 text-black">{item.title}</Text>
                <Text className="mt-0.5 text-[14px] text-[#718078]">{item.time}</Text>
                <Text className="mt-0.5 text-[14px] text-[#718078]">{item.location}</Text>
              </Card>
            )}
          />
        ) : (
          <>
            <View className="mb-[14px] flex-row flex-wrap gap-2">
              {statusFilters.map((status) => (
                <TouchableOpacity key={status} className={`rounded-full border px-[14px] py-1.5 ${filter === status ? 'border-[#FF6B09] bg-[rgba(255,107,9,0.1)]' : 'border-[#D5E1D8] bg-white'}`} onPress={() => setFilter(status)}>
                  <Text className={`text-[11px] font-bold capitalize ${filter === status ? 'text-[#FF6B09]' : 'text-[#718078]'}`}>{status === 'all' ? 'All' : status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredMembers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 140 }}
              renderItem={({ item }) => (
                <Card padding="md" blurVariant="strong" style={{ marginBottom: 14 }}>
                  <View className="flex-row items-center gap-[14px]">
                    <View className="h-11 w-11 items-center justify-center rounded-full bg-[rgba(10,147,54,0.12)]">
                      <Text className="font-bold text-[#A84413]">{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[16px] font-bold text-black">{item.name}</Text>
                      <Text className="text-[14px] text-[#718078]">{item.email}</Text>
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

export default MembersScreen;
