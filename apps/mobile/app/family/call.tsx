/**
 * Video Call Screen
 * 
 * Per spec:
 * - Full-screen video display
 * - Large answer button (no swipe gestures)
 * - Minimal controls during call (face + end button)
 * - Graceful quality degradation
 * - Auto-answer option
 * 
 * Designed for cognitive support users:
 * - Very simple interface
 * - Large touch targets
 * - Clear visual feedback
 */

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useVideo } from '../../src/contexts/ServicesContext';
import { useData } from '../../src/contexts/DataContext';
import { CallState, Participant } from '../../src/services/interfaces';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../src/constants/theme';

export default function CallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string; photo?: string }>();
  const { themeColors, triggerHaptic } = useAccessibility();
  const { familyMembers } = useData();
  const video = useVideo();
  
  const [callState, setCallState] = useState<CallState>('idle');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Get contact info from params or family members
  const contactId = params.id || '';
  const foundMember = familyMembers.find(m => m.id === contactId);
  const contact = {
    name: foundMember?.name || params.name || 'Family Member',
    photo_url: foundMember?.photo_url || params.photo || 'https://i.pravatar.cc/200',
  };

  // Set up video service listeners
  useEffect(() => {
    const unsubState = video.onStateChange((state) => {
      setCallState(state);
    });

    const unsubParticipants = video.onParticipantsChange((p) => {
      setParticipants(p);
    });

    // Start the call when screen loads
    startCall();

    return () => {
      unsubState();
      unsubParticipants();
    };
  }, [contactId]);

  const startCall = useCallback(async () => {
    try {
      await video.initialize();
      await video.call(contactId, { video: true, audio: true });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }, [video, contactId]);

  const handleEndCall = useCallback(async () => {
    triggerHaptic('heavy');
    await video.endCall();
    router.back();
  }, [video, router, triggerHaptic]);

  const handleToggleMute = useCallback(async () => {
    triggerHaptic('light');
    const muted = await video.toggleMute();
    setIsMuted(muted);
  }, [video, triggerHaptic]);

  const handleToggleVideo = useCallback(async () => {
    triggerHaptic('light');
    const videoOff = await video.toggleVideo();
    setIsVideoOff(videoOff);
  }, [video, triggerHaptic]);

  // Calling/Connecting state
  if (callState === 'calling' || callState === 'idle') {
    return (
      <Screen showBack={false} padded={false} scrollable={false}>
        <View style={[styles.container, styles.callingContainer]}>
          {/* Contact photo */}
          <Image
            source={{ uri: contact.photo_url }}
            style={styles.callingPhoto}
          />
          
          {/* Status */}
          <Text variant="h2" center style={{ marginTop: spacing.lg }}>
            {contact.name}
          </Text>
          <Text variant="bodyLarge" color={themeColors.textSecondary} center style={{ marginTop: spacing.sm }}>
            Calling...
          </Text>

          {/* Pulsing indicator */}
          <View style={styles.pulseContainer}>
            <View style={[styles.pulse, styles.pulse1]} />
            <View style={[styles.pulse, styles.pulse2]} />
            <Ionicons name="call" size={32} color={colors.white} />
          </View>

          {/* End Call */}
          <View style={styles.callingActions}>
            <TouchableOpacity
              onPress={handleEndCall}
              style={styles.endCallButton}
              accessible
              accessibilityRole="button"
              accessibilityLabel="End call"
            >
              <Ionicons name="close" size={36} color={colors.white} />
            </TouchableOpacity>
            <Text variant="body" center style={{ marginTop: spacing.md }}>
              Cancel
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  // Connected state - simplified per spec
  return (
    <Screen showBack={false} padded={false} scrollable={false}>
      <View style={styles.container}>
        {/* Remote participant (full screen) */}
        <View style={styles.remoteVideoContainer}>
          {/* In real implementation, this would be RTCView */}
          <Image
            source={{ uri: contact.photo_url }}
            style={styles.remoteVideo}
            accessibilityLabel={`Video call with ${contact.name}`}
          />
          
          {/* Name overlay */}
          <View style={styles.nameOverlay}>
            <Text variant="h3" color={colors.white}>
              {contact.name}
            </Text>
          </View>
        </View>

        {/* Local participant (small pip) */}
        <View style={styles.localVideoContainer}>
          {isVideoOff ? (
            <View style={[styles.localVideo, styles.videoOff]}>
              <Ionicons name="videocam-off" size={24} color={colors.white} />
            </View>
          ) : (
            <View style={[styles.localVideo, { backgroundColor: colors.gray[300] }]}>
              <Text variant="caption" color={colors.white}>You</Text>
            </View>
          )}
        </View>

        {/* Controls - minimal per spec */}
        <View style={styles.controlsContainer}>
          {/* Mute */}
          <TouchableOpacity
            onPress={handleToggleMute}
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
          >
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={28}
              color={colors.white}
            />
          </TouchableOpacity>

          {/* End Call - Large and prominent */}
          <TouchableOpacity
            onPress={handleEndCall}
            style={styles.endCallButtonLarge}
            accessible
            accessibilityRole="button"
            accessibilityLabel="End call"
          >
            <Ionicons name="call" size={36} color={colors.white} />
          </TouchableOpacity>

          {/* Video */}
          <TouchableOpacity
            onPress={handleToggleVideo}
            style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          >
            <Ionicons
              name={isVideoOff ? 'videocam-off' : 'videocam'}
              size={28}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[900],
  },
  // Calling state
  callingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  callingPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: colors.family.main,
  },
  pulseContainer: {
    marginTop: spacing['2xl'],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.family.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.family.main,
    opacity: 0.5,
  },
  pulse1: {
    // Animation would be applied here
  },
  pulse2: {
    // Animation would be applied here
  },
  callingActions: {
    position: 'absolute',
    bottom: spacing['2xl'],
    alignItems: 'center',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Connected state
  remoteVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nameOverlay: {
    position: 'absolute',
    top: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: spacing.sm,
  },
  localVideoContainer: {
    position: 'absolute',
    top: spacing.xl + 50,
    right: spacing.lg,
  },
  localVideo: {
    width: 100,
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  videoOff: {
    backgroundColor: colors.gray[700],
  },
  controlsContainer: {
    position: 'absolute',
    bottom: spacing['2xl'],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.gray[600],
  },
  endCallButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
});
