import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';

const digestSections = [
  {
    id: 's1',
    title: 'Anchored In Purpose',
    body: 'Today, remember that your identity is secured in Christ before your achievements are measured by the world. Let your day begin from devotion, not pressure. The Holy Spirit is not asking you to rush; He is teaching you to move with clarity, obedience, and peace.',
  },
  {
    id: 's2',
    title: 'Practice For Today',
    body: 'Pause three times today to pray this: "Lord, align my decisions with Your will." In moments of uncertainty, return to Scripture before reacting. The grace of God is not only for recovery, it is also for direction.',
  },
  {
    id: 's3',
    title: 'Scripture Focus',
    body: '"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to Him, and He will make your paths straight." - Proverbs 3:5-6',
  },
];

const DigestScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/home');
  };

  return (
    <LinearGradient colors={['#040404', '#090909', '#101010']} className="flex-1">
      <StatusBar barStyle="light-content" />

      <View className="px-5 pb-3 pt-8">
        <Animated.View entering={FadeIn.duration(260)} className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full border border-[#2D2D2D] bg-[#151515]"
            onPress={handleBackPress}
          >
            <Feather name="chevron-left" size={18} color="#F4F4F4" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-[17px] font-semibold text-white">Daily Digest</Text>
            <Text className="text-[11px] text-[#A0A0A0]">Visionary Nation</Text>
          </View>

          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-[#2D2D2D] bg-[#151515]">
            <Feather name="more-vertical" size={16} color="#EFEFEF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false} className="px-5">
        <Animated.View entering={SlideInUp.duration(300)}>
          <Card
            animated={false}
            padding="md"
            blurVariant="none"
            style={{
              borderColor: '#2A2A2A',
              backgroundColor: '#111111',
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="mr-3 flex-1">
                <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#8F8F8F]">Daily Visionary Digest</Text>
                <Text className="mt-2 text-[28px] font-extrabold leading-8 text-white">Walk in Purpose Today</Text>
                <Text className="mt-2 text-[12px] text-[#A8A8A8]">Thursday, July 2, 2026 • 4 min read</Text>
              </View>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#24180D]">
                <Feather name="sunrise" size={20} color="#FF9A3D" />
              </View>
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full border border-[#303030] bg-[#171717]">
                  <Feather name="bookmark" size={15} color="#FF7A00" />
                </TouchableOpacity>
                <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full border border-[#303030] bg-[#171717]">
                  <Feather name="heart" size={15} color="#16A34A" />
                </TouchableOpacity>
                <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full border border-[#303030] bg-[#171717]">
                  <Feather name="share-2" size={15} color="#F0F0F0" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="rounded-full border border-[#2F2F2F] bg-[#161616] px-3 py-1.5">
                <View className="flex-row items-center gap-2">
                  <Feather name="volume-2" size={13} color="#E8E8E8" />
                  <Text className="text-[11px] font-semibold text-[#D8D8D8]">Listen</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {digestSections.map((section, index) => (
          <Animated.View key={section.id} entering={SlideInUp.delay(60 + index * 60).duration(300)} className="mt-4">
            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                borderColor: '#2A2A2A',
                backgroundColor: '#121212',
              }}
            >
              <Text className="text-[16px] font-bold text-white">{section.title}</Text>
              <Text className="mt-2 text-[14px] leading-6 text-[#C7C7C7]">{section.body}</Text>
            </Card>
          </Animated.View>
        ))}

        <Animated.View entering={SlideInUp.delay(240).duration(300)} className="mt-4">
          <Card
            animated={false}
            padding="md"
            blurVariant="none"
            style={{
              borderColor: '#214229',
              backgroundColor: '#111A13',
            }}
          >
            <View className="flex-row items-start gap-3">
              <View className="mt-1 h-9 w-9 items-center justify-center rounded-full bg-[#1E3A26]">
                <Feather name="book-open" size={16} color="#7DDA98" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-[#EAF7EE]">Reflection Prompt</Text>
                <Text className="mt-1 text-[12px] leading-5 text-[#A8C9B2]">
                  Which decision today needs deeper trust in God instead of your own understanding?
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      <View className="absolute bottom-8 right-5">
        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-[#FF7A00]"
          style={{
            shadowColor: '#FF7A00',
            shadowOpacity: 0.35,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
          onPress={() => router.push('/(app)/ai')}
        >
          <Feather name="cpu" size={22} color="#1A130D" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default DigestScreen;