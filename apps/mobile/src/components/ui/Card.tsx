/**
 * Accessible Card Component
 * 
 * ENFORCES:
 * - 60dp minimum touch target when pressable
 * - Haptic feedback on press
 * - Consistent styling
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacityProps,
} from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import {
  MIN_TOUCH_TARGET,
  colors,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';

interface CardProps {
  onPress?: () => void;
  backgroundColor?: string;
  padding?: keyof typeof spacing;
  elevated?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
  style?: ViewProps['style'];
}

export function Card({
  onPress,
  backgroundColor,
  padding = 'md',
  elevated = true,
  children,
  style,
  accessibilityLabel,
}: CardProps) {
  const { triggerHaptic, themeColors, animationDuration } = useAccessibility();

  const handlePress = useCallback(() => {
    triggerHaptic('light');
    onPress?.();
  }, [onPress, triggerHaptic]);

  const cardStyles = [
    styles.card,
    {
      backgroundColor: backgroundColor || themeColors.surface,
      padding: spacing[padding],
    },
    elevated && shadows.md,
    // ENFORCED: Minimum touch target when pressable
    onPress && styles.pressable,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={cardStyles}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  pressable: {
    // ENFORCED: Minimum touch target
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
  },
});

export default Card;
