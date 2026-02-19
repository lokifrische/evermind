/**
 * Family Member Detail Screen
 * 
 * Per spec:
 * - Message history per sender
 * - Video/voice message playback
 * - Option to call
 */

import { useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET, borderRadius } from '../../src/constants/theme';

// Mock data
const mockFamilyMember = {
  id: '1',
  name: 'Sarah',
  relationship: 'Your Daughter',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  funFact: 'She loves gardening and visits every Tuesday',
  messages: [
    {
      id: '1',
      type: 'voice',
      content: 'Hi Mom! Just wanted to say I love you and I\'ll see you Tuesday!',
      timestamp: '2 hours ago',
      duration: '0:32',
    },
    {
      id: '2',
      type: 'video',
      content: 'Look at the garden!',
      timestamp: 'Yesterday',
      duration: '1:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop',
    },
    {
      id: '3',
      type: 'voice',
      content: 'Happy Sunday, Mom! Hope you\'re having a wonderful day.',
      timestamp: '3 days ago',
      duration: '0:18',
    },
  ],
};

export default function FamilyMemberScreen() {
  const { id } = useLocalSearchParams();
  const { themeColors, triggerHaptic } = useAccessibility();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayMessage = (messageId: string) => {
    triggerHaptic('medium');
    setPlayingId(playingId === messageId ? null : messageId);
    // Would play audio/video
  };

  const handleCall = () => {
    triggerHaptic('heavy');
    // Would initiate video call
  };

  const renderMessage = ({ item }: { item: typeof mockFamilyMember.messages[0] }) => (
    <Card style={styles.messageCard}>
      <TouchableOpacity
        onPress={() => handlePlayMessage(item.id)}
        style={styles.messageContent}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${item.type} message from ${mockFamilyMember.name}: ${item.content}`}
      >
        {item.type === 'video' && item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={styles.videoThumbnail} />
        ) : (
          <View style={[styles.audioIcon, { backgroundColor: colors.family.light }]}>
            <Ionicons
              name={playingId === item.id ? 'pause' : 'play'}
              size={32}
              color={colors.family.main}
            />
          </View>
        )}
        
        <View style={styles.messageText}>
          <Text variant="body" numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text variant="caption" color={themeColors.textSecondary}>
              {item.timestamp}
            </Text>
            <Text variant="caption" color={themeColors.textSecondary}>
              {item.duration}
            </Text>
          </View>
        </View>

        {item.type === 'video' && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={24} color={colors.white} />
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );

  return (
    <Screen showBack showMic={false} padded={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: mockFamilyMember.photoUrl }} style={styles.profilePhoto} />
        <Text variant="h1" center style={{ marginTop: spacing.md }}>
          {mockFamilyMember.name}
        </Text>
        <Text variant="bodyLarge" color={colors.family.main} center>
          {mockFamilyMember.relationship}
        </Text>
        <Text variant="body" color={themeColors.textSecondary} center style={{ marginTop: spacing.sm }}>
          {mockFamilyMember.funFact}
        </Text>

        {/* Call Button */}
        <Button
          title="Video Call"
          variant="primary"
          size="large"
          icon={<Ionicons name="videocam" size={24} color={colors.white} />}
          onPress={handleCall}
          color={colors.family.main}
          style={{ marginTop: spacing.lg }}
        />
      </View>

      {/* Messages */}
      <View style={styles.messagesSection}>
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Recent Messages
        </Text>
        <FlatList
          data={mockFamilyMember.messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: colors.family.light,
  },
  messagesSection: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageCard: {
    overflow: 'hidden',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  audioIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: borderRadius.md,
  },
  playOverlay: {
    position: 'absolute',
    left: spacing.md + 28,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
