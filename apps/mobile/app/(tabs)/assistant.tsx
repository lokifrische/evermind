/**
 * AI Assistant Tab Screen - "Talk to Me"
 * 
 * Per spec:
 * - Voice-first interaction
 * - Visual feedback during listening/processing/responding
 * - Text input alternative
 * - Warm, patient, encouraging personality
 * - Platform navigation and task execution
 * - Companionship and grounding
 * - Safety guardrails
 */

import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET, borderRadius } from '../../src/constants/theme';

type MessageRole = 'user' | 'assistant';
type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Mock responses for the assistant
const mockResponses: Record<string, string> = {
  default: "I'm here to help you, dear. What would you like to do today?",
  greeting: "Hello! It's wonderful to talk with you. How are you feeling today?",
  time: `It's ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} right now.`,
  date: `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`,
  confused: "That's okay, dear. You're at home and safe. Would you like to look at some photos of your family?",
  help: "I can help you look at memories, call your family, play games, or just chat. What sounds nice?",
};

function getAssistantResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return mockResponses.greeting;
  }
  if (lowerInput.includes('time')) {
    return mockResponses.time;
  }
  if (lowerInput.includes('date') || lowerInput.includes('day')) {
    return mockResponses.date;
  }
  if (lowerInput.includes('confused') || lowerInput.includes('where am i') || lowerInput.includes('lost')) {
    return mockResponses.confused;
  }
  if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
    return mockResponses.help;
  }
  
  return mockResponses.default;
}

const quickActions = [
  { id: 'call', label: 'Call Family', icon: 'videocam' },
  { id: 'memories', label: 'Show Memories', icon: 'images' },
  { id: 'time', label: "What Time Is It?", icon: 'time' },
  { id: 'date', label: "What Day Is It?", icon: 'calendar' },
];

export default function AssistantScreen() {
  const { themeColors, triggerHaptic, scaledFontSize } = useAccessibility();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm here to help you. You can talk to me or tap a button below. What would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const flatListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for listening state
  useEffect(() => {
    if (assistantState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [assistantState]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    triggerHaptic('light');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate processing
    setAssistantState('processing');
    setTimeout(() => {
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAssistantResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setAssistantState('idle');
    }, 1000);
  };

  const handleMicPress = () => {
    triggerHaptic('medium');
    if (assistantState === 'listening') {
      setAssistantState('idle');
    } else {
      setAssistantState('listening');
      // In a real app, this would start speech recognition
      // For mock, simulate hearing something after 3 seconds
      setTimeout(() => {
        sendMessage("Hello");
        setAssistantState('idle');
      }, 3000);
    }
  };

  const handleQuickAction = (actionId: string) => {
    triggerHaptic('medium');
    switch (actionId) {
      case 'time':
        sendMessage("What time is it?");
        break;
      case 'date':
        sendMessage("What day is it?");
        break;
      case 'call':
        sendMessage("I want to call my family");
        break;
      case 'memories':
        sendMessage("Show me some memories");
        break;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      {item.role === 'assistant' && (
        <View style={styles.avatarContainer}>
          <Ionicons name="happy" size={24} color={colors.assistant.main} />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.role === 'user' ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          variant="bodyLarge"
          color={item.role === 'user' ? colors.white : themeColors.text}
        >
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen title="Talk to Me" showMic={false} padded={false} scrollable={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleQuickAction(action.id)}
              style={styles.quickAction}
              accessible
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Ionicons name={action.icon as any} size={20} color={colors.assistant.main} />
              <Text variant="caption" weight="medium" style={{ marginLeft: spacing.xs }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: themeColors.surface }]}>
          {/* Large Microphone Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={handleMicPress}
              style={[
                styles.micButton,
                assistantState === 'listening' && styles.micButtonActive,
              ]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={assistantState === 'listening' ? 'Stop listening' : 'Start talking'}
            >
              <Ionicons
                name={assistantState === 'listening' ? 'stop' : 'mic'}
                size={32}
                color={colors.white}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Status Text */}
          <Text
            variant="body"
            color={themeColors.textSecondary}
            center
            style={styles.statusText}
          >
            {assistantState === 'listening' && 'Listening...'}
            {assistantState === 'processing' && 'Thinking...'}
            {assistantState === 'speaking' && 'Speaking...'}
            {assistantState === 'idle' && 'Tap the microphone to talk'}
          </Text>

          {/* Text Input Alternative */}
          <View style={styles.textInputRow}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: themeColors.background,
                  color: themeColors.text,
                  fontSize: scaledFontSize(16),
                },
              ]}
              placeholder="Or type here..."
              placeholderTextColor={themeColors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => sendMessage(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={() => sendMessage(inputText)}
              style={styles.sendButton}
              disabled={!inputText.trim()}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Ionicons
                name="send"
                size={24}
                color={inputText.trim() ? colors.assistant.main : colors.gray[400]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.assistant.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: colors.assistant.main,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.assistant.light,
    borderRadius: 20,
    minHeight: MIN_TOUCH_TARGET - 16,
  },
  inputContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.assistant.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  micButtonActive: {
    backgroundColor: colors.error,
  },
  statusText: {
    marginBottom: spacing.md,
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    height: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
