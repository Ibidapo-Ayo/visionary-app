import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@components/Card';
import ScreenBackground from '@components/ScreenBackground';
import { colors, radius, spacing, typography } from '../../lib/theme';

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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>Scripture-led guidance for your daily walk</Text>
        </View>

        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <Animated.View
              key={message.id}
              entering={FadeIn.duration(220)}
              style={[styles.bubbleWrap, message.role === 'user' ? styles.userWrap : styles.assistantWrap]}
            >
              <Card
                padding="md"
                blurVariant={message.role === 'user' ? 'strong' : 'soft'}
                style={message.role === 'user' ? styles.userBubble : styles.assistantBubble}
              >
                {message.role === 'assistant' && <Text style={styles.scriptureTag}>Guided Response</Text>}
                <Text style={styles.messageText}>{message.content}</Text>
              </Card>
            </Animated.View>
          ))}

          {isLoading && (
            <Card padding="sm" blurVariant="soft" style={styles.loadingBubble}>
              <Text style={styles.loadingText}>Composing a reflective response...</Text>
            </Card>
          )}
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.composerInner}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Ask about faith, prayer, community..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity style={[styles.send, (!inputValue.trim() || isLoading) && styles.sendDisabled]} onPress={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
              <MaterialCommunityIcons name="send" size={17} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  bubbleWrap: {
    maxWidth: '88%',
  },
  userWrap: {
    alignSelf: 'flex-end',
  },
  assistantWrap: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: 'rgba(121,168,255,0.25)',
    borderColor: 'rgba(121,168,255,0.4)',
  },
  assistantBubble: {
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  scriptureTag: {
    color: colors.accentGold,
    fontSize: typography.caption.fontSize,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  composer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 102,
    paddingTop: spacing.sm,
  },
  composerInner: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    maxHeight: 110,
    paddingVertical: spacing.xs,
    fontSize: typography.body.fontSize,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
});

export default AIChatScreen;
