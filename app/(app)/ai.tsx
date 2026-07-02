import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../lib/theme';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
};

const AIChatScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I'm your AI counselor, trained in the teachings and lived wisdom of Christ. How can I support you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        'God cares about your worries. Cast your anxiety on Him because He cares for you. Start with 1 Peter 5:7.',
        'When your fear overwhelms you, bring your thoughts to God in prayer. His peace will guard your heart and mind.',
        'Try this short prayer: Lord Jesus, settle my heart and give me wisdom for this decision. Amen.',
      ];

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/home');
  };

  return (
    <LinearGradient colors={['#040404', '#0A0A0A', '#101010']} className="flex-1">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View className="px-5 pb-3" style={{ paddingTop: insets.top + 12 }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-[#171717]" onPress={handleBackPress}>
              <Feather name="chevron-left" size={18} color="#F5F5F5" />
            </TouchableOpacity>
            <View className="items-center">
              <Text className="text-[17px] font-semibold text-white">AI Counselor</Text>
              <Text className="text-[11px] text-[#A0A0A0]">Always beside you</Text>
            </View>
            <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-[#171717]">
              <Feather name="more-vertical" size={16} color="#F5F5F5" />
            </TouchableOpacity>
          </View>
          <View className="mt-4 self-center rounded-full border border-[#2E3B2E] bg-[#111A11] px-4 py-2">
            <View className="flex-row items-center gap-2">
              <View className="h-5 w-5 rounded-full bg-[#2A5D2F]" />
              <Text className="text-[11px] font-medium text-[#A4D8A8]">Conversation is private and prayerful</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 14 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-3 px-5">
            <View className="self-start rounded-[18px] rounded-bl-[6px] bg-[#121F12] px-4 py-3">
              <Text className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#8BC18F]">AI Counselor</Text>
              <Text className="mt-1 max-w-[280px] text-[14px] leading-5 text-[#E7F3E8]">{messages[0].content}</Text>
            </View>

            <Animated.View entering={FadeIn.duration(220)} className="self-end rounded-[18px] rounded-br-[6px] bg-[#E56E12] px-4 py-3">
              <Text className="max-w-[265px] text-[14px] leading-5 text-[#1F1407]">
                I'm struggling with anxiety and overthinking, what does God say about this?
              </Text>
            </Animated.View>

            {messages.slice(1).map((message) => (
              <Animated.View
                key={message.id}
                entering={FadeIn.duration(220)}
                className={message.role === 'user' ? 'self-end rounded-[18px] rounded-br-[6px] bg-[#E56E12] px-4 py-3' : 'self-start rounded-[18px] rounded-bl-[6px] bg-[#121F12] px-4 py-3'}
              >
                <Text className={`max-w-[280px] text-[14px] leading-5 ${message.role === 'user' ? 'text-[#1F1407]' : 'text-[#E7F3E8]'}`}>
                  {message.content}
                </Text>
              </Animated.View>
            ))}

            {isLoading && (
              <View className="self-start rounded-[18px] rounded-bl-[6px] bg-[#121F12] px-4 py-3">
                <Text className="text-[13px] text-[#9EB29F]">Preparing a prayerful response...</Text>
              </View>
            )}

            <View className="mt-2">
              <Text className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#8B8B8B]">Related Scriptures</Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                {['1 Peter 5:7', 'Philippians 4:6-7', 'Matthew 11:28-30'].map((verse) => (
                  <TouchableOpacity key={verse} className="rounded-full border border-[#2F2F2F] bg-[#161616] px-3 py-1.5" onPress={() => setInputValue(`Reflect on ${verse}`)}>
                    <Text className="text-[11px] font-medium text-[#D4D4D4]">{verse}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="h-1" />
          </View>
        </ScrollView>

        <View className="px-5 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          <View className="flex-row items-center rounded-full border border-[#2B2B2B] bg-[#121212] px-2 py-2">
            <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-[#1A1A1A]">
              <Feather name="mic" size={16} color="#A0A0A0" />
            </TouchableOpacity>
            <TextInput
              style={{ flex: 1, color: '#EFEFEF', paddingHorizontal: 10, fontSize: 15 }}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Ask anything..."
              placeholderTextColor="#7C7C7C"
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              className={`h-9 w-9 items-center justify-center rounded-full bg-[#FF7A00] ${(!inputValue.trim() || isLoading) ? 'opacity-40' : ''}`}
              onPress={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Feather name="send" size={16} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AIChatScreen;
