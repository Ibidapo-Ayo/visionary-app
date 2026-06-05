import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAppStore } from '@store/appStore';
import Card from '@components/Card';
import Button from '@components/Button';

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I\'m Visionary AI. How can I help you today with scripture, spiritual guidance, or church matters?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Let me share some insights...',
        'I found several scriptures related to that topic. Would you like me to share them?',
        'That\'s important. Here\'s what I think might help...',
      ];

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const quickQuestions = [
    '[Scripture] Share a scripture about faith',
    '[Strength] How to overcome challenges',
    '[Prayer] Prayer for today',
    '[Community] Serving the community',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn}>
          <Text style={styles.title}>Visionary AI</Text>
          <Text style={styles.subtitle}>Your Spiritual Guide</Text>
        </Animated.View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 1 && (
            <Animated.View
              style={styles.quickQuestionsSection}
              entering={SlideInUp}
            >
              <Text style={styles.quickTitle}>Quick Questions</Text>
              <View style={styles.quickButtonsGrid}>
                {quickQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickButton}
                    onPress={() => {
                      setInputValue(question);
                    }}
                    activeOpacity={0.7}
                  >
                    <Card variant="outlined" animated={false}>
                      <Text style={styles.quickButtonText}>{question}</Text>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.role === 'user'
                  ? styles.userMessageWrapper
                  : styles.assistantMessageWrapper,
              ]}
              entering={FadeIn}
            >
              <Card
                variant={
                  message.role === 'user'
                    ? 'default'
                    : 'outlined'
                }
                animated={false}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user'
                      ? styles.userMessageText
                      : styles.assistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Card>
            </Animated.View>
          ))}

          {isLoading && (
            <Animated.View
              style={styles.typingIndicator}
              entering={FadeIn}
            >
              <Card variant="outlined" animated={false}>
                <View style={styles.typingDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </Card>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input */}
        <Animated.View
          style={styles.inputContainer}
          entering={SlideInUp}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#64748b"
              value={inputValue}
              onChangeText={setInputValue}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputValue.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Text style={styles.sendIcon}>{'>'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimerText}>
            AI responses are powered by scripture and church wisdom
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
  },
  keyboardView: {
    flex: 1,
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
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  quickQuestionsSection: {
    marginBottom: 24,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  quickButtonsGrid: {
    gap: 8,
  },
  quickButton: {
    marginBottom: 4,
  },
  quickButtonText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  messageWrapper: {
    marginVertical: 8,
    maxWidth: '85%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  assistantMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#cbd5e1',
  },
  messageTime: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '400',
  },
  typingIndicator: {
    marginVertical: 8,
    maxWidth: '50%',
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
  },
  inputContainer: {
    borderTopColor: '#2d3a5a',
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#64748b',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#64748b',
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 16,
    color: '#111226',
    fontWeight: '700',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default AIChatScreen;
