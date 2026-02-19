/**
 * Family Tab Screen
 * 
 * Per spec:
 * - Video/voice message inbox with sender faces as large circular photos
 * - Tap face to play most recent message
 * - Family photo feed
 * - Quick access to video calling
 */

import { useState, useMemo } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useData } from '../../src/contexts/DataContext';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../src/constants/theme';

// Fallback family members
const fallbackFamily = [
  {
    id: '1',
    name: 'Sarah',
    relationship: 'Your Daughter',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    hasNewMessage: true,
    funFact: 'She loves gardening',
  },
  {
    id: '2',
    name: 'David',
    relationship: 'Your Son',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    hasNewMessage: false,
    funFact: 'He is a teacher',
  },
  {
    id: '3',
    name: 'Robert',
    relationship: 'Your Husband',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    hasNewMessage: true,
    funFact: 'He loves jazz music',
  },
  {
    id: '4',
    name: 'Emma',
    relationship: 'Your Granddaughter',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    hasNewMessage: true,
    funFact: 'She loves to paint',
  },
  {
    id: '5',
    name: 'Tommy',
    relationship: 'Your Grandson',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
    hasNewMessage: false,
    funFact: 'He plays soccer',
  },
  {
    id: '6',
    name: 'Lucy',
    relationship: 'Your Sister',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    hasNewMessage: false,
    funFact: 'She lives in Florida',
  },
];

// Mock photo feed
const mockPhotos = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop',
    sender: 'Sarah',
    caption: 'Beautiful day in the garden! 🌸',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=600&fit=crop',
    sender: 'Emma',
    caption: 'My new painting!',
    timestamp: 'Yesterday',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop',
    sender: 'David',
    caption: 'Family dinner was amazing',
    timestamp: '3 days ago',
  },
];

type TabType = 'messages' | 'photos' | 'call';

export default function FamilyScreen() {
  const router = useRouter();
  const { themeColors, triggerHaptic } = useAccessibility();
  const { familyMembers: supabaseFamilyMembers, messages } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('messages');

  // Use Supabase data if available, otherwise fallback
  const familyData = useMemo(() => {
    if (supabaseFamilyMembers.length > 0) {
      return supabaseFamilyMembers.map(m => ({
        id: m.id,
        name: m.name,
        relationship: m.relationship,
        photoUrl: m.photo_url || 'https://i.pravatar.cc/200',
        hasNewMessage: messages.some(msg => msg.from_member_id === m.id && !msg.is_listened),
        funFact: m.fun_fact || '',
      }));
    }
    return fallbackFamily;
  }, [supabaseFamilyMembers, messages]);

  const handleTabPress = (tab: TabType) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const handleFamilyMemberPress = (member: typeof familyData[0]) => {
    triggerHaptic('medium');
    router.push(`/family/${member.id}`);
  };

  const handleCallPress = (member: typeof familyData[0]) => {
    triggerHaptic('heavy');
    router.push(`/family/call?id=${member.id}&name=${encodeURIComponent(member.name)}&photo=${encodeURIComponent(member.photoUrl)}` as any);
  };

  const handleReaction = (photoId: string, emoji: string) => {
    triggerHaptic('success');
    // Send reaction
  };

  const renderMessageInbox = () => (
    <View style={styles.inboxContainer}>
      <Text variant="body" color={themeColors.textSecondary} style={styles.inboxHint}>
        Tap a face to hear their latest message
      </Text>
      <View style={styles.familyGrid}>
        {familyData.map((member) => (
          <TouchableOpacity
            key={member.id}
            onPress={() => handleFamilyMemberPress(member)}
            style={styles.familyMember}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`${member.name}, ${member.relationship}${member.hasNewMessage ? ', has new message' : ''}`}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: member.photoUrl }} style={styles.avatar} />
              {member.hasNewMessage && <View style={styles.newIndicator} />}
            </View>
            <Text variant="body" weight="semibold" center numberOfLines={1}>
              {member.name}
            </Text>
            <Text variant="caption" color={themeColors.textSecondary} center numberOfLines={1}>
              {member.relationship}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPhotoFeed = () => (
    <FlatList
      data={mockPhotos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.photoList}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Card style={styles.photoCard}>
          <View style={styles.photoHeader}>
            <Text variant="body" weight="semibold">
              {item.sender}
            </Text>
            <Text variant="caption" color={themeColors.textSecondary}>
              {item.timestamp}
            </Text>
          </View>
          <Image source={{ uri: item.imageUrl }} style={styles.photoImage} />
          <Text variant="body" style={styles.photoCaption}>
            {item.caption}
          </Text>
          {/* One-tap reaction buttons per spec */}
          <View style={styles.reactionRow}>
            {['❤️', '😊', '👍'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReaction(item.id, emoji)}
                style={styles.reactionButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`React with ${emoji}`}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
    />
  );

  const renderCallContacts = () => (
    <View style={styles.callContainer}>
      <Text variant="body" color={themeColors.textSecondary} style={styles.callHint}>
        Tap to start a video call
      </Text>
      <View style={styles.callGrid}>
        {familyData.slice(0, 4).map((member) => (
          <TouchableOpacity
            key={member.id}
            onPress={() => handleCallPress(member)}
            style={styles.callContact}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Call ${member.name}`}
          >
            <Image source={{ uri: member.photoUrl }} style={styles.callAvatar} />
            <View style={styles.callOverlay}>
              <Ionicons name="videocam" size={32} color={colors.white} />
            </View>
            <Text variant="h3" weight="bold" center style={{ marginTop: spacing.sm }}>
              {member.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Screen title="Family" showMic padded={false}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {[
          { key: 'messages', label: 'Messages', icon: 'chatbubble' },
          { key: 'photos', label: 'Photos', icon: 'images' },
          { key: 'call', label: 'Video Call', icon: 'videocam' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handleTabPress(tab.key as TabType)}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            accessible
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={activeTab === tab.key ? colors.family.main : themeColors.textSecondary}
            />
            <Text
              variant="caption"
              weight={activeTab === tab.key ? 'semibold' : 'normal'}
              color={activeTab === tab.key ? colors.family.main : themeColors.textSecondary}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'messages' && renderMessageInbox()}
        {activeTab === 'photos' && renderPhotoFeed()}
        {activeTab === 'call' && renderCallContacts()}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    minHeight: MIN_TOUCH_TARGET,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.family.light,
  },
  content: {
    flex: 1,
  },
  // Messages Inbox
  inboxContainer: {
    paddingHorizontal: spacing.lg,
  },
  inboxHint: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  familyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  familyMember: {
    width: 100,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  newIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.family.main,
    borderWidth: 3,
    borderColor: colors.white,
  },
  // Photo Feed
  photoList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  photoCard: {
    overflow: 'hidden',
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  photoImage: {
    width: '100%',
    aspectRatio: 1,
  },
  photoCaption: {
    padding: spacing.md,
  },
  reactionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  reactionButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: MIN_TOUCH_TARGET / 2,
  },
  // Video Call
  callContainer: {
    paddingHorizontal: spacing.lg,
  },
  callHint: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  callGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  callContact: {
    width: 140,
    alignItems: 'center',
  },
  callAvatar: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  callOverlay: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 120,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
