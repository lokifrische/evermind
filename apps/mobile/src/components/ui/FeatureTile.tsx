/**
 * Feature Tile Component
 * 
 * Large, colorful tiles for the home screen
 * Per spec: 4 fixed-position color-coded feature tiles
 * 
 * ENFORCES:
 * - Large touch targets (entire tile is pressable)
 * - Clear visual hierarchy
 * - Accessibility labels
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Text } from './Text';
import {
  spacing,
  borderRadius,
  shadows,
  colors,
} from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = spacing.md;
const TILE_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - TILE_GAP) / 2;

interface FeatureTileProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  hasNewContent?: boolean;
}

export function FeatureTile({
  title,
  icon,
  color,
  backgroundColor,
  onPress,
  hasNewContent = false,
}: FeatureTileProps) {
  const { triggerHaptic, scaledFontSize, highContrast } = useAccessibility();

  const handlePress = useCallback(() => {
    triggerHaptic('medium');
    onPress();
  }, [onPress, triggerHaptic]);

  const tileBackgroundColor = highContrast ? colors.black : backgroundColor;
  const iconColor = highContrast ? colors.white : color;
  const borderColor = highContrast ? colors.white : 'transparent';

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.tile,
        {
          backgroundColor: tileBackgroundColor,
          borderColor,
          borderWidth: highContrast ? 2 : 0,
        },
        !highContrast && shadows.lg,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${title}${hasNewContent ? ', has new content' : ''}`}
      accessibilityHint={`Open ${title}`}
    >
      {/* New content indicator - subtle dot, not number badge per spec */}
      {hasNewContent && (
        <View style={[styles.newIndicator, { backgroundColor: color }]} />
      )}
      
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={iconColor} />
      </View>
      
      <Text
        variant="h3"
        weight="bold"
        color={iconColor}
        center
        style={{ marginTop: spacing.md }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Grid layout for 4 tiles
export function FeatureTileGrid({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.grid}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 12,
    height: 12,
    borderRadius: 6,
    // Subtle indicator, not aggressive badge per spec
  },
});

export default FeatureTile;
