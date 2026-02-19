/**
 * Memory Detail Screen
 * 
 * Per spec:
 * - Full-screen photo display with navigation arrows
 * - Audio playback option
 * - Slideshow mode
 */

import { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock memory data
const mockMemory = {
  id: '1',
  title: 'Christmas 2024',
  description: 'The whole family together for the holidays. Everyone was there - Sarah, David, Emma, Tommy, and Lucy flew in from Florida!',
  photos: [
    'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=600&fit=crop',
  ],
  audioUrl: null, // Would be a URL to voice recording
  date: 'December 25, 2024',
  tags: ['Family', 'Holiday', 'Everyone'],
};

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { themeColors, triggerHaptic } = useAccessibility();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      triggerHaptic('light');
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < mockMemory.photos.length - 1) {
      triggerHaptic('light');
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePlayAudio = () => {
    triggerHaptic('medium');
    setIsPlaying(!isPlaying);
    // Would play associated audio
  };

  const handleSlideshow = () => {
    triggerHaptic('medium');
    // Would start slideshow mode
  };

  return (
    <Screen showBack title={mockMemory.title} showMic={false} padded={false} scrollable={false}>
      <View style={styles.container}>
        {/* Photo Display */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: mockMemory.photos[currentPhotoIndex] }}
            style={styles.photo}
            resizeMode="cover"
          />

          {/* Navigation Arrows */}
          {currentPhotoIndex > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={[styles.navButton, styles.navButtonLeft]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Previous photo"
            >
              <Ionicons name="chevron-back" size={32} color={colors.white} />
            </TouchableOpacity>
          )}

          {currentPhotoIndex < mockMemory.photos.length - 1 && (
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.navButton, styles.navButtonRight]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Next photo"
            >
              <Ionicons name="chevron-forward" size={32} color={colors.white} />
            </TouchableOpacity>
          )}

          {/* Photo Counter */}
          <View style={styles.photoCounter}>
            <Text variant="body" color={colors.white}>
              {currentPhotoIndex + 1} of {mockMemory.photos.length}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text variant="caption" color={themeColors.textSecondary}>
            {mockMemory.date}
          </Text>
          <Text variant="bodyLarge" style={{ marginTop: spacing.sm }}>
            {mockMemory.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagRow}>
            {mockMemory.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text variant="caption" color={colors.memories.main}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Button
              title={isPlaying ? 'Pause Story' : 'Hear the Story'}
              variant="outline"
              icon={<Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={colors.memories.main} />}
              onPress={handlePlayAudio}
              color={colors.memories.main}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="Slideshow"
              variant="primary"
              icon={<Ionicons name="images" size={20} color={colors.white} />}
              onPress={handleSlideshow}
              color={colors.memories.main}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    backgroundColor: colors.black,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -MIN_TOUCH_TARGET / 2,
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonLeft: {
    left: spacing.md,
  },
  navButtonRight: {
    right: spacing.md,
  },
  photoCounter: {
    position: 'absolute',
    bottom: spacing.md,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  infoSection: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.memories.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
});
