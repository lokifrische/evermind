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
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useData } from '../../src/contexts/DataContext';
import { useAssistant, useTTS, useSpeech } from '../../src/contexts/ServicesContext';
import { AssistantMessage, AssistantContext } from '../../src/services/interfaces';
import { colors, spacing, MIN_TOUCH_TARGET, borderRadius } from '../../src/constants/theme';

type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

const quickActions = [
  { id: 'call', label: 'Call Family', icon: 'videocam' },
  { id: 'memories', label: 'Show Memories', icon: 'images' },
  { id: 'time', label: "What Time Is It?", icon: 'time' },
  { id: 'calm', label: "Help Me Relax", icon: 'leaf' },
];

export default function AssistantScreen() {
  const router = useRouter();
  const { themeColors, triggerHaptic, scaledFontSize } = useAccessibility();
  const { user } = useData();
  const assistant = useAssistant();
  const tts = useTTS();
  const speech = useSpeech();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [interimTranscript, setInterimTranscript] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Build assistant context
  const getContext = (): AssistantContext => ({
    patientName: user.preferredName || user.name,
    timeOfDay: getTimeOfDay(),
  });

  // Initialize with greeting
  useEffect(() => {
    initializeAssistant();
  }, []);

  // Set up speech recognition event handlers
  useEffect(() => {
    // Handle speech results
    const unsubResult = speech.onResult((result) => {
      if (result.isFinal) {
        // Final result - send as message
        setInterimTranscript('');
        if (result.transcript.trim()) {
          sendMessage(result.transcript.trim());
        }
        setAssistantState('idle');
      } else {
        // Interim result - show as preview
        setInterimTranscript(result.transcript);
      }
    });

    // Handle speech errors
    const unsubError = speech.onError((error) => {
      console.error('Speech recognition error:', error.message);
      setInterimTranscript('');
      setAssistantState('idle');
      // Don't show error for common cases like no speech detected
      if (!error.message.includes('no-speech') && !error.message.includes('aborted')) {
        triggerHaptic('error');
      }
    });

    // Handle state changes
    const unsubState = speech.onStateChange((isListening) => {
      if (!isListening && assistantState === 'listening') {
        // Speech recognition stopped
        setInterimTranscript('');
      }
    });

    return () => {
      unsubResult();
      unsubError();
      unsubState();
    };
  }, [speech, assistantState]);

  const initializeAssistant = async () => {
    const context = getContext();
    const suggestionList = await assistant.getSuggestions(context);
    setSuggestions(suggestionList);

    // Add initial greeting
    const greeting = getTimeOfDay() === 'morning' 
      ? `Good morning, ${context.patientName}! How can I help you today?`
      : getTimeOfDay() === 'afternoon'
      ? `Good afternoon, ${context.patientName}! What would you like to do?`
      : getTimeOfDay() === 'evening'
      ? `Good evening, ${context.patientName}! Is there anything I can help with?`
      : `Hello, ${context.patientName}. I'm here if you need anything.`;

    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }]);
  };

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

  const sendMessage = async (text: string) => {
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

    // Get assistant response
    setAssistantState('processing');
    try {
      const context = getContext();
      const history: AssistantMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));

      const response = await assistant.chat(text, context, history);

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update suggestions if provided
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

      // Speak the response
      setAssistantState('speaking');
      await tts.speak(response.message, { rate: 0.9 });
      setAssistantState('idle');

    } catch (error) {
      console.error('Assistant error:', error);
      setAssistantState('idle');
    }
  };

  const handleMicPress = async () => {
    triggerHaptic('medium');
    
    if (assistantState === 'listening') {
      // Stop listening
      try {
        await speech.stopListening();
      } catch (error) {
        console.error('Error stopping speech:', error);
      }
      setAssistantState('idle');
      setInterimTranscript('');
    } else {
      // Start listening
      setAssistantState('listening');
      setInterimTranscript('');
      
      try {
        await speech.startListening({
          language: 'en-US',
          interimResults: true,
          continuous: false,
        });
      } catch (error) {
        console.error('Error starting speech:', error);
        setAssistantState('idle');
        triggerHaptic('error');
      }
    }
  };

  const handleQuickAction = (actionId: string) => {
    triggerHaptic('medium');
    switch (actionId) {
      case 'time':
        const timeStr = new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        const response = `It's ${timeStr} right now.`;
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        }]);
        tts.speak(response);
        break;
      case 'call':
        router.push('/(tabs)/family');
        break;
      case 'memories':
        router.push('/(tabs)/memories');
        break;
      case 'calm':
        handleGrounding();
        break;
    }
  };

  const handleGrounding = async () => {
    setAssistantState('processing');
    try {
      const context = getContext();
      const response = await assistant.getGroundingResponse(context);
      
      const groundingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, groundingMessage]);

      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

      setAssistantState('speaking');
      await tts.speak(response.message, { rate: 0.85 });
      setAssistantState('idle');
    } catch (error) {
      console.error('Grounding error:', error);
      setAssistantState('idle');
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
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

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSuggestionPress(suggestion)}
                style={styles.suggestionChip}
                accessible
                accessibilityRole="button"
                accessibilityLabel={suggestion}
              >
                <Text variant="body" color={colors.assistant.main}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

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

          {/* Status Text / Interim Transcript */}
          <Text
            variant="body"
            color={interimTranscript ? themeColors.text : themeColors.textSecondary}
            center
            style={styles.statusText}
          >
            {assistantState === 'listening' && interimTranscript 
              ? `"${interimTranscript}"`
              : assistantState === 'listening' && 'Listening...'}
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
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  suggestionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.assistant.light,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.assistant.main,
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
    backgroundColor: colors.white,
    borderRadius: 20,
    minHeight: MIN_TOUCH_TARGET - 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
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
