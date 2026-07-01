import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import ScreenBackground from '@components/ScreenBackground';
import { colors } from '../../lib/theme';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
};

const AIChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Visionary AI. Ask for scripture, prayer direction, or leadership insight.',
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
        'Consider James 1:5 and pray with expectation for wisdom before your next step.',
        'Try this reflection: where can you practice love in action today within your community?',
        'I recommend beginning with gratitude, then asking for clarity and courage in service.',
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

  return (
    <ScreenBackground>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="px-7 pb-[14px] pt-9">
          <Text className="text-[26px] font-extrabold leading-[34px] text-black">AI Assistant</Text>
          <Text className="text-[14px] text-[#718078]">Ask, decide, and act faster.</Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 18 }} showsVerticalScrollIndicator={false}>
          <View className="gap-[14px] px-7">
            <Card padding="sm" blurVariant="strong" style={{ marginBottom: 8 }}>
              <Text className="mb-2 text-[11px] font-bold uppercase text-[#D85A16]">Suggested prompts</Text>
              <View className="flex-row flex-wrap gap-2">
              {['Give me a prayer focus', 'Scripture for leadership', 'How do I serve better?'].map((prompt) => (
                <TouchableOpacity key={prompt} className="rounded-full border border-[#D5E1D8] bg-[#F8FBF9] px-2.5 py-1.5" onPress={() => setInputValue(prompt)}>
                  <Text className="text-[11px] font-semibold text-[#2D3A33]">{prompt}</Text>
                </TouchableOpacity>
              ))}
              </View>
            </Card>

            {messages.map((message) => (
              <Animated.View
                key={message.id}
                entering={FadeIn.duration(220)}
                className={`max-w-[88%] ${message.role === 'user' ? 'self-end' : 'self-start'}`}
              >
                <Card
                  padding="md"
                  blurVariant="strong"
                  style={message.role === 'user' ? { backgroundColor: 'rgba(255,107,9,0.1)', borderColor: 'rgba(255,107,9,0.22)' } : { backgroundColor: '#FFFFFF' }}
                >
                  {message.role === 'assistant' && <Text className="mb-1 text-[11px] font-bold uppercase tracking-[0.5px] text-[#0A9336]">Guided Response</Text>}
                  <Text className="text-[16px] leading-6 text-black">{message.content}</Text>
                </Card>
              </Animated.View>
            ))}

            {isLoading && (
              <Card padding="sm" blurVariant="soft" style={{ alignSelf: 'flex-start' }}>
                <Text className="text-[14px] text-[#718078]">Composing a reflective response...</Text>
              </Card>
            )}
            </View>
        </ScrollView>

        <View className="px-7 pb-[102px] pt-2">
          <View className="flex-row items-end gap-2 rounded-3xl border border-[#D5E1D8] bg-white px-[14px] py-2">
            <TextInput
              style={{ flex: 1, color: colors.black, maxHeight: 110, paddingVertical: 8, fontSize: 16 }}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Ask about faith, prayer, leadership..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity className={`h-9 w-9 items-center justify-center rounded-full bg-[#FF6B09] ${(!inputValue.trim() || isLoading) ? 'opacity-40' : ''}`} onPress={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
              <Feather name="send" size={17} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
};

export default AIChatScreen;
