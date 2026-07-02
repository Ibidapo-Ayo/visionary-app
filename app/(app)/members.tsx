import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import { LinearGradient } from 'expo-linear-gradient';

const attendanceItems = [
  { id: 'a1', date: 'May 18, 2026', time: '10:15 AM', status: 'On Time' },
  { id: 'a2', date: 'May 14, 2026', time: '7:02 PM', status: 'On Time' },
  { id: 'a3', date: 'May 11, 2026', time: '10:07 AM', status: 'On Time' },
  { id: 'a4', date: 'May 7, 2026', time: '7:16 PM', status: 'On Time' },
];

const MembersScreen = () => {
  const progress = 87;

  return (
    <LinearGradient colors={['#040404', '#090909', '#101010']} className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} className="px-5 pt-8">
        <Animated.View entering={FadeIn.duration(280)} className="mb-4 mt-2 flex-row items-center justify-between">
          <View>
            <Text className="text-[24px] font-bold text-white">My Attendance</Text>
            <Text className="mt-1 text-[12px] text-[#8F8F8F]">Track your consistency and growth</Text>
          </View>
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-[#161616]">
            <Feather name="calendar" size={16} color="#E7E7E7" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={SlideInUp.duration(320)}>
          <Card
            animated={false}
            padding="md"
            blurVariant="none"
            style={{
              borderColor: '#2B2B2B',
              backgroundColor: '#111111',
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] font-semibold uppercase tracking-[1px] text-[#8D8D8D]">Total Attendance</Text>
                <Text className="mt-1 text-[36px] font-extrabold leading-[42px] text-white">42</Text>
                <Text className="text-[12px] text-[#A0A0A0]">This Month</Text>
              </View>
              <View className="h-[92px] w-[92px] items-center justify-center rounded-full border-4 border-[#1E4025]">
                <View className="h-[70px] w-[70px] items-center justify-center rounded-full bg-[#121B13]">
                  <Text className="text-[16px] font-bold text-[#6AD487]">{progress}%</Text>
                </View>
              </View>
            </View>
            <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#1E1E1E]">
              <View className="h-full rounded-full bg-[#16A34A]" style={{ width: `${progress}%` }} />
            </View>
            <Text className="mt-2 text-right text-[11px] text-[#7CC98E]">Presence Rate</Text>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(60).duration(320)} className="mt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#8A8A8A]">Recent Attendance</Text>

          {attendanceItems.map((item) => (
            <Card
              key={item.id}
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                marginTop: 10,
                borderColor: '#2A2A2A',
                backgroundColor: '#121212',
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-white">{item.date}</Text>
                  <Text className="mt-1 text-[11px] text-[#8E8E8E]">{item.time}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-[#16A34A]" />
                  <Text className="text-[12px] font-medium text-[#95D5A6]">{item.status}</Text>
                </View>
              </View>
            </Card>
          ))}
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120).duration(320)} className="mt-4">
          <TouchableOpacity className="rounded-full bg-[#FF7A00] px-5 py-3">
            <Text className="text-center text-[14px] font-bold text-[#191919]">View Full History</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MembersScreen;
