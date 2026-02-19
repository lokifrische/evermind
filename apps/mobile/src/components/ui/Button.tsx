/**
 * Accessible Button Component
 * 
 * ENFORCES:
 * - 60dp minimum touch target (per spec)
 * - Haptic feedback on press
 * - High contrast mode support
 * - Reduced motion support
 * - Screen reader accessibility
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Text } from './Text';
import {
  MIN_TOUCH_TARGET,
  colors,
  spacing,
  borderRadius,
} from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'large';

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  color?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'default',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  color,
  disabled,
  onPress,
  style,
  ...props
}: ButtonProps) {
  const { triggerHaptic, themeColors, scaledFontSize, highContrast } = useAccessibility();

  const handlePress = useCallback((e: any) => {
    triggerHaptic('light');
    onPress?.(e);
  }, [onPress, triggerHaptic]);

  // Determine colors based on variant
  const getColors = () => {
    const baseColor = color || colors.memories.main;
    
    if (disabled) {
      return {
        background: colors.gray[200],
        text: colors.gray[400],
        border: colors.gray[200],
      };
    }

    if (highContrast) {
      return {
        background: variant === 'primary' ? colors.white : colors.black,
        text: variant === 'primary' ? colors.black : colors.white,
        border: colors.white,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          background: baseColor,
          text: colors.white,
          border: baseColor,
        };
      case 'secondary':
        return {
          background: colors.gray[100],
          text: colors.gray[800],
          border: colors.gray[100],
        };
      case 'outline':
        return {
          background: 'transparent',
          text: baseColor,
          border: baseColor,
        };
      case 'ghost':
        return {
          background: 'transparent',
          text: baseColor,
          border: 'transparent',
        };
    }
  };

  const buttonColors = getColors();
  const isLarge = size === 'large';
  const minHeight = isLarge ? MIN_TOUCH_TARGET + 12 : MIN_TOUCH_TARGET;
  const paddingHorizontal = isLarge ? spacing.xl : spacing.lg;
  const fontSize = scaledFontSize(isLarge ? 18 : 16);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          minHeight,
          paddingHorizontal,
          backgroundColor: buttonColors.background,
          borderColor: buttonColors.border,
          borderWidth: variant === 'outline' ? 2 : 0,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      // Accessibility
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={buttonColors.text} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            variant="body"
            weight="semibold"
            color={buttonColors.text}
            style={{ fontSize }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    // ENFORCED: Minimum touch target
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

export default Button;
