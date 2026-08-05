import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '@components/Card';
import { mockBibleJourneySessionPlan, mockBibleReadingChapters } from '@services/mockData';
import type { ReadingPeriod } from '@/types/index';
import { useBibleJourneyStore } from '@store/bibleJourneyStore';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

const buildInitialReflection = (assignedChapters: string[]) => {
  const primary = assignedChapters.join(', ');

  return [
    `Summary: Today's reading (${primary}) shows how God forms people through covenant, trust, and obedience.`,
    'Major Themes: Faith under pressure, covenant identity, mercy, and kingdom understanding.',
    'Key Lessons: God remains faithful to His word; obedience shapes spiritual maturity; kingdom fruit grows in receptive hearts.',
    'Practical Application: Choose one area today to obey God promptly, show mercy to someone, and anchor your decisions in Scripture.',
    'Reflection Questions:',
    '1. Which verse challenged me to trust God more today?',
    '2. Where do I need to obey quickly instead of delaying?',
    '3. How can I express kingdom mercy in a practical way today?',
    'Short Prayer: Lord Jesus, plant Your word deeply in my heart. Help me walk in obedience, mercy, and faith today. Amen.',
  ].join('\n\n');
};

const buildFollowUpResponse = (question: string, assignedChapters: string[]) => {
  const lowered = question.toLowerCase();
  const scopeLine = `Let's stay rooted in today's assigned reading: ${assignedChapters.join(', ')}.`;

  if (/theme|themes|lesson|learn/.test(lowered)) {
    return `${scopeLine}\n\nA strong thread is faithful obedience in uncertain moments. The text invites you to trust God's promises and live them out practically today.`;
  }

  if (/pray|prayer/.test(lowered)) {
    return `${scopeLine}\n\nPrayer: Father, give me a hearing heart and steady obedience. Let today's Word shape my thoughts, my words, and my decisions. In Jesus' name, amen.`;
  }

  if (/apply|application|practice|do/i.test(lowered)) {
    return `${scopeLine}\n\nPractical next step: choose one verse from today's chapters, write it down, pray over it, and obey one specific action before the day ends.`;
  }

  if (/anything|general|other topic|unrelated/.test(lowered)) {
    return `This space is dedicated to Bible Reflection for today's assigned reading. ${scopeLine}`;
  }

  return `${scopeLine}\n\nGreat question. Based on these chapters, the invitation is to trust God's character, respond in obedience, and live the Word concretely today.`;
};

const BibleReadingReflectionScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  const params = useLocalSearchParams<{ reference?: string; period?: string }>();
  const period: ReadingPeriod = params.period === 'evening' ? 'evening' : 'morning';

  const markReflectionCompleteForToday = useBibleJourneyStore((state) => state.markReflectionCompleteForToday);
  const isReflectionCompleteForToday = useBibleJourneyStore((state) => state.isReflectionCompleteForToday);
  const getCompletedChaptersForToday = useBibleJourneyStore((state) => state.getCompletedChaptersForToday);

  const assignedReferences = period === 'morning' ? mockBibleJourneySessionPlan.morning : mockBibleJourneySessionPlan.evening;
  const completedReferences = getCompletedChaptersForToday(period);
  const isSessionUnlocked = assignedReferences.every((reference) => completedReferences.includes(reference));
  const reflectionDone = isReflectionCompleteForToday(period);

  const chapterTitles = useMemo(
    () =>
      assignedReferences
        .map((reference) => mockBibleReadingChapters.find((chapter) => chapter.reference === reference)?.title)
        .filter((value): value is string => Boolean(value)),
    [assignedReferences],
  );

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-reflection',
      role: 'assistant',
      content: buildInitialReflection(assignedReferences),
    },
  ]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/bible-reading');
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading || !isSessionUnlocked) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: buildFollowUpResponse(trimmed, assignedReferences),
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  const handleCompleteReflection = () => {
    if (!isSessionUnlocked) {
      return;
    }

    markReflectionCompleteForToday({ period });
    router.replace('/(app)/bible-journey');
  };

  const containerGradient = isDark
    ? (['#05070A', '#0B1119', '#0E1720'] as const)
    : (['#F3F7FB', '#EAF0F8', '#E4ECF7'] as const);

  return (
    <LinearGradient colors={containerGradient} className="flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View className="px-5 pb-3" style={{ paddingTop: insets.top + 10 }}>
          <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center justify-between">
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full border"
              style={{
                borderColor: isDark ? '#2D3F56' : '#C9D7E8',
                backgroundColor: isDark ? '#132031' : '#EDF3FA',
              }}
              onPress={handleBackPress}
            >
              <Feather name="chevron-left" size={18} color={isDark ? '#EAF1FC' : '#2D425D'} />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-[17px] font-semibold" style={{ color: isDark ? '#F2F6FD' : '#22364E' }}>
                Bible Reflection
              </Text>
              <Text className="text-[11px]" style={{ color: isDark ? '#A8BDD6' : '#5A7897' }}>
                {period === 'morning' ? 'Morning Session' : 'Evening Session'}
              </Text>
            </View>

            <View
              className="h-10 w-10 items-center justify-center rounded-full border"
              style={{
                borderColor: isDark ? '#2D3F56' : '#C9D7E8',
                backgroundColor: isDark ? '#132031' : '#EDF3FA',
              }}
            >
              <Feather name="book" size={15} color={isDark ? '#EAF1FC' : '#2D425D'} />
            </View>
          </Animated.View>

          <Animated.View entering={SlideInUp.delay(40).duration(260)} className="mt-3 rounded-2xl border px-3 py-2"
            style={{
              borderColor: isDark ? '#2A4564' : '#C7D8EC',
              backgroundColor: isDark ? 'rgba(16,29,45,0.72)' : 'rgba(245,250,255,0.84)',
            }}
          >
            <Text className="text-[10px] font-semibold uppercase tracking-[1px]" style={{ color: isDark ? '#95C2EC' : '#3A6A98' }}>
              Assigned Chapters
            </Text>
            <Text className="mt-1 text-[12px] leading-5" style={{ color: isDark ? '#D8E8FA' : '#315273' }}>
              {assignedReferences.join(' • ')}
            </Text>
          </Animated.View>
        </View>

        {!isSessionUnlocked ? (
          <View className="flex-1 px-5">
            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                borderColor: '#3C352D',
                backgroundColor: '#19140F',
              }}
            >
              <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-[#FFCFA5]">Bible Reflection Locked</Text>
              <Text className="mt-2 text-[13px] leading-6 text-[#E7D2BC]">
                Complete every assigned chapter in this session to unlock Bible Reflection chat.
              </Text>
            </Card>
          </View>
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 14 }}>
              <View className="mb-2 flex-row flex-wrap gap-2">
                {chapterTitles.map((title) => (
                  <View
                    key={title}
                    className="rounded-full border px-2.5 py-1"
                    style={{
                      borderColor: isDark ? '#2F4A6A' : '#C8D8E9',
                      backgroundColor: isDark ? '#15253A' : '#EEF4FB',
                    }}
                  >
                    <Text className="text-[10px] font-semibold" style={{ color: isDark ? '#B8D4EE' : '#466A8D' }}>
                      {title}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="gap-3">
                {messages.map((message, index) => (
                  <Animated.View
                    key={message.id}
                    entering={FadeIn.delay(index === 0 ? 0 : 70).duration(220)}
                    className={message.role === 'assistant' ? 'self-start rounded-[18px] rounded-bl-[8px] border px-4 py-3' : 'self-end rounded-[18px] rounded-br-[8px] px-4 py-3'}
                    style={
                      message.role === 'assistant'
                        ? {
                            maxWidth: '94%',
                            borderColor: isDark ? '#2C4665' : '#C7D8EB',
                            backgroundColor: isDark ? '#122236' : '#F2F8FF',
                          }
                        : {
                            maxWidth: '84%',
                            backgroundColor: isDark ? '#3A73A6' : '#2D6FA8',
                          }
                    }
                  >
                    <Text
                      className="text-[13px] leading-6"
                      style={{ color: message.role === 'assistant' ? (isDark ? '#E4F0FD' : '#2B425D') : '#ECF5FF' }}
                    >
                      {message.content}
                    </Text>
                  </Animated.View>
                ))}

                {isLoading ? (
                  <View
                    className="self-start rounded-[16px] border px-4 py-2.5"
                    style={{
                      borderColor: isDark ? '#2C4665' : '#C7D8EB',
                      backgroundColor: isDark ? '#122236' : '#F2F8FF',
                    }}
                  >
                    <Text className="text-[12px]" style={{ color: isDark ? '#A9C8E8' : '#4A6E93' }}>
                      Reflecting on today's chapters...
                    </Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>

            <View className="px-5 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
              <View
                className="flex-row items-end rounded-3xl border px-2 py-2"
                style={{
                  borderColor: isDark ? '#2A4564' : '#C9D7E8',
                  backgroundColor: isDark ? '#101E30' : '#EFF5FB',
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    color: isDark ? '#E9F2FD' : '#26405A',
                    paddingHorizontal: 10,
                    fontSize: 14,
                    maxHeight: 120,
                  }}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Ask about today's reading..."
                  placeholderTextColor={isDark ? '#7F9FBE' : '#7A94AE'}
                  multiline
                  maxLength={600}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  className={`h-9 w-9 items-center justify-center rounded-full ${(!inputValue.trim() || isLoading) ? 'opacity-40' : ''}`}
                  style={{ backgroundColor: isDark ? '#4C85B9' : '#2F73AB' }}
                  onPress={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Feather name="send" size={15} color="#ECF5FF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className={`mt-3 rounded-full px-4 py-3 ${reflectionDone ? 'bg-[#1B3521]' : 'bg-[#16A34A]'}`}
                onPress={handleCompleteReflection}
              >
                <Text className={`text-center text-[12px] font-semibold ${reflectionDone ? 'text-[#DDF3E3]' : 'text-[#102311]'}`}>
                  {reflectionDone ? 'Reflection Completed' : 'Complete Reflection'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default BibleReadingReflectionScreen;
