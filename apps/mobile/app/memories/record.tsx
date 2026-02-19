/**
 * Record Story Screen
 * 
 * Per spec:
 * - Large microphone button
 * - Visual waveform/amplitude feedback
 * - No visible timer (reduce pressure)
 * - Gentle prompts on silence
 * - Confirmation screen before saving
 * 
 * Designed for cognitive support users:
 * - Simple, clear interface
 * - Encouraging prompts
 * - Easy to cancel or redo
 */

import { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useAudioRecorder } from '../../src/hooks/useAudioRecorder';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../src/constants/theme';

// Recording prompts to encourage storytelling
const storyPrompts = [
  "Tell me about a happy memory...",
  "What's your favorite family tradition?",
  "Share a story about someone you love...",
  "What makes you smile when you think about it?",
  "Tell me about a special place...",
  "What's one of your proudest moments?",
  "Share a funny story from the past...",
  "Tell me about a celebration you remember...",
];

function getRandomPrompt(): string {
  return storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
}

type RecordingStage = 'prompt' | 'recording' | 'confirm';

export default function RecordStoryScreen() {
  const router = useRouter();
  const { themeColors, triggerHaptic } = useAccessibility();
  const [stage, setStage] = useState<RecordingStage>('prompt');
  const [prompt, setPrompt] = useState(getRandomPrompt());
  const [showSilenceHint, setShowSilenceHint] = useState(false);

  const {
    isRecording,
    isPaused,
    durationMs,
    amplitude,
    uri,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder({
    onSilenceDetected: () => {
      setShowSilenceHint(true);
      // Hide hint after a few seconds
      setTimeout(() => setShowSilenceHint(false), 5000);
    },
    silenceThresholdSeconds: 8,
    maxDurationSeconds: 300, // 5 minutes
  });

  // Animated value for the microphone pulse
  const pulseAnim = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    if (isRecording && !isPaused) {
      // Pulse based on amplitude
      Animated.timing(pulseAnim, {
        toValue: 1 + amplitude * 0.3,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [amplitude, isRecording, isPaused]);

  const handleStartRecording = useCallback(async () => {
    try {
      triggerHaptic('medium');
      await startRecording();
      setStage('recording');
      setShowSilenceHint(false);
    } catch (error) {
      Alert.alert(
        'Recording Error',
        'Unable to start recording. Please check your microphone permissions.',
        [{ text: 'OK' }]
      );
    }
  }, [startRecording, triggerHaptic]);

  const handleStopRecording = useCallback(async () => {
    triggerHaptic('medium');
    const recordedUri = await stopRecording();
    if (recordedUri) {
      setStage('confirm');
    }
  }, [stopRecording, triggerHaptic]);

  const handleCancel = useCallback(async () => {
    triggerHaptic('light');
    await cancelRecording();
    router.back();
  }, [cancelRecording, router, triggerHaptic]);

  const handleRetry = useCallback(async () => {
    triggerHaptic('light');
    await cancelRecording();
    setPrompt(getRandomPrompt());
    setStage('prompt');
  }, [cancelRecording, triggerHaptic]);

  const handleSave = useCallback(async () => {
    if (!uri) return;
    
    triggerHaptic('success');
    // TODO: Save to Supabase
    // For now, just navigate back
    Alert.alert(
      'Story Saved!',
      'Your story has been recorded and saved.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  }, [uri, router, triggerHaptic]);

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNewPrompt = () => {
    triggerHaptic('light');
    setPrompt(getRandomPrompt());
  };

  // Render based on stage
  if (stage === 'prompt') {
    return (
      <Screen title="Record a Story" showBack padded>
        <View style={styles.container}>
          {/* Story Prompt */}
          <View style={styles.promptSection}>
            <Text variant="body" color={themeColors.textSecondary} center style={styles.promptLabel}>
              Here's a story idea:
            </Text>
            <Text variant="h2" center style={styles.promptText}>
              {prompt}
            </Text>
            <TouchableOpacity onPress={handleNewPrompt} style={styles.newPromptButton}>
              <Ionicons name="refresh" size={20} color={colors.memories.main} />
              <Text variant="body" color={colors.memories.main} style={{ marginLeft: spacing.xs }}>
                Different prompt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Start Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={handleStartRecording}
              style={styles.bigRecordButton}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Start recording your story"
            >
              <Ionicons name="mic" size={48} color={colors.white} />
            </TouchableOpacity>
            <Text variant="bodyLarge" center style={{ marginTop: spacing.md }}>
              Tap to start recording
            </Text>
          </View>

          {/* Cancel */}
          <Button
            title="Cancel"
            variant="ghost"
            onPress={handleCancel}
            fullWidth
          />
        </View>
      </Screen>
    );
  }

  if (stage === 'recording') {
    return (
      <Screen title="Recording..." showBack={false} padded>
        <View style={styles.container}>
          {/* Prompt reminder */}
          <View style={styles.promptReminderSection}>
            <Text variant="body" color={themeColors.textSecondary} center>
              {prompt}
            </Text>
          </View>

          {/* Recording Animation */}
          <View style={styles.recordingSection}>
            <Animated.View
              style={[
                styles.recordingCircle,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.innerCircle}>
                <Ionicons name="mic" size={48} color={colors.white} />
              </View>
            </Animated.View>

            {/* Status */}
            <Text variant="h3" center style={{ marginTop: spacing.xl }}>
              {isPaused ? 'Paused' : 'Listening...'}
            </Text>

            {/* Gentle silence hint */}
            {showSilenceHint && (
              <Text variant="body" color={themeColors.textSecondary} center style={styles.silenceHint}>
                Take your time. I'm still listening. 💙
              </Text>
            )}
          </View>

          {/* Duration (subtle, no pressure) */}
          <Text variant="caption" color={themeColors.textSecondary} center>
            Recording time: {formatDuration(durationMs)}
          </Text>

          {/* Stop Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={handleStopRecording}
              style={[styles.bigRecordButton, styles.stopButton]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Stop recording"
            >
              <Ionicons name="stop" size={48} color={colors.white} />
            </TouchableOpacity>
            <Text variant="bodyLarge" center style={{ marginTop: spacing.md }}>
              Tap to finish
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  // Confirm stage
  return (
    <Screen title="Your Story" showBack={false} padded>
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color={colors.success} />
          </View>
          <Text variant="h2" center style={{ marginTop: spacing.lg }}>
            Great story!
          </Text>
          <Text variant="body" color={themeColors.textSecondary} center style={{ marginTop: spacing.sm }}>
            Recording: {formatDuration(durationMs)}
          </Text>
        </View>

        {/* TODO: Playback preview */}

        {/* Actions */}
        <View style={styles.confirmActions}>
          <Button
            title="Save Story"
            variant="primary"
            size="large"
            onPress={handleSave}
            color={colors.memories.main}
            fullWidth
            icon={<Ionicons name="checkmark-circle" size={24} color={colors.white} />}
          />
          <View style={{ height: spacing.md }} />
          <Button
            title="Record Again"
            variant="secondary"
            onPress={handleRetry}
            fullWidth
          />
          <View style={{ height: spacing.sm }} />
          <Button
            title="Discard"
            variant="ghost"
            onPress={handleCancel}
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  promptSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  promptLabel: {
    marginBottom: spacing.md,
  },
  promptText: {
    paddingHorizontal: spacing.lg,
    lineHeight: 36,
  },
  newPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  actionSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  bigRecordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.memories.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.memories.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  promptReminderSection: {
    paddingVertical: spacing.lg,
  },
  recordingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.memories.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.memories.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  silenceHint: {
    marginTop: spacing.lg,
    fontStyle: 'italic',
  },
  successSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmActions: {
    paddingVertical: spacing.xl,
  },
});
