/**
 * Home Screen
 * 
 * Per spec:
 * - Time-of-day greeting using user's name and photo
 * - Full natural-language date display
 * - Four fixed-position color-coded feature tiles
 * - Daily highlight strip with rotating content
 * - Subtle new-content indicators (no number badges)
 */

import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { FeatureTile, FeatureTileGrid } from '../../src/components/ui/FeatureTile';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useData } from '../../src/contexts/DataContext';
import { colors, spacing, featureTiles } from '../../src/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
}

export default function HomeScreen() {
  const router = useRouter();
  const { themeColors, scaledFontSize } = useAccessibility();
  const { user, familyMembers, memories, messages, isLoading } = useData();

  // Get daily highlight (most recent memory or first one)
  const dailyHighlight = memories[0] || {
    id: '1',
    title: 'No memories yet',
    description: 'Add some memories to see them here',
    thumbnail_url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=200&fit=crop',
  };

  // Check if there are new messages
  const hasNewMessages = messages.some(m => !m.is_listened);

  const navigateTo = (route: string) => {
    // Remove leading slash for expo-router
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    router.push(cleanRoute as any);
  };

  return (
    <Screen showMic padded={false}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <View style={styles.greetingRow}>
          <View style={styles.greetingText}>
            <Text variant="h1" style={{ marginBottom: spacing.xs }}>
              {getGreeting()},
            </Text>
            <Text variant="h1" color={colors.memories.main}>
              {user.preferredName || user.name}
            </Text>
          </View>
          
          <Image
            source={{ uri: user.photoUrl }}
            style={styles.userPhoto}
            accessibilityLabel={`Photo of ${user.name}`}
          />
        </View>
        
        {/* Full natural-language date display per spec */}
        <Text variant="bodyLarge" color={themeColors.textSecondary} style={{ marginTop: spacing.sm }}>
          {getFormattedDate()}
        </Text>
      </View>

      {/* Feature Tiles - 2x2 Grid */}
      <View style={styles.tilesSection}>
        <FeatureTileGrid>
          {featureTiles.map((tile) => (
            <FeatureTile
              key={tile.id}
              title={tile.title}
              icon={tile.icon as any}
              color={tile.color}
              backgroundColor={tile.backgroundColor}
              onPress={() => navigateTo(tile.route)}
              hasNewContent={tile.id === 'family' && hasNewMessages}
            />
          ))}
        </FeatureTileGrid>
      </View>

      {/* Daily Highlight Strip */}
      <View style={styles.highlightSection}>
        <Text variant="h3" style={{ marginBottom: spacing.md, paddingHorizontal: spacing.lg }}>
          Today's Highlight
        </Text>
        
        <Card
          onPress={() => navigateTo(`/memories/${dailyHighlight.id}`)}
          padding="sm"
          style={styles.highlightCard}
          accessibilityLabel={`Memory: ${dailyHighlight.title}`}
        >
          <Image
            source={{ uri: dailyHighlight.thumbnail_url || 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=200&fit=crop' }}
            style={styles.highlightImage}
          />
          <View style={styles.highlightContent}>
            <Text variant="h3" numberOfLines={1}>
              {dailyHighlight.title}
            </Text>
            <Text variant="body" color={themeColors.textSecondary} numberOfLines={1}>
              {dailyHighlight.description || 'View this memory'}
            </Text>
          </View>
        </Card>
      </View>

      {/* Quick Family View */}
      <View style={styles.familySection}>
        <Text variant="h3" style={{ marginBottom: spacing.md, paddingHorizontal: spacing.lg }}>
          Your Family
        </Text>
        
        <View style={styles.familyAvatars}>
          {(familyMembers.length > 0 ? familyMembers.slice(0, 4) : [
            { id: '1', name: 'Sarah', photo_url: 'https://i.pravatar.cc/100?img=10' },
            { id: '2', name: 'David', photo_url: 'https://i.pravatar.cc/100?img=11' },
            { id: '3', name: 'Robert', photo_url: 'https://i.pravatar.cc/100?img=12' },
            { id: '4', name: 'Emma', photo_url: 'https://i.pravatar.cc/100?img=13' },
          ]).map((member) => (
            <View key={member.id} style={styles.familyAvatar}>
              <Image
                source={{ uri: member.photo_url || 'https://i.pravatar.cc/100' }}
                style={styles.familyAvatarImage}
                accessibilityLabel={member.name}
              />
              <Text variant="caption" center numberOfLines={1}>
                {member.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greetingSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingText: {
    flex: 1,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: spacing.md,
  },
  tilesSection: {
    paddingBottom: spacing.xl,
  },
  highlightSection: {
    paddingBottom: spacing.xl,
  },
  highlightCard: {
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  highlightImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  highlightContent: {
    padding: spacing.md,
  },
  familySection: {
    paddingBottom: spacing['2xl'],
  },
  familyAvatars: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  familyAvatar: {
    alignItems: 'center',
    width: 70,
  },
  familyAvatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: spacing.xs,
  },
});
