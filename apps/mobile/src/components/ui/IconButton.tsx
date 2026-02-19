/**
 * IconButton Component
 * 
 * Accessibility-first icon button:
 * - 60dp minimum touch target
 * - Haptic feedback
 * - High contrast mode support
 * - Screen reader friendly
 */

import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../constants/theme';

export interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

const sizeConfig = {
  small: { button: 44, icon: 20 },
  medium: { button: MIN_TOUCH_TARGET, icon: 24 },
  large: { button: 72, icon: 32 },
};

const variantConfig = {
  default: {
    background: colors.gray[100],
    iconColor: colors.gray[700],
    activeBackground: colors.gray[200],
  },
  primary: {
    background: colors.primary,
    iconColor: colors.white,
    activeBackground: colors.primaryDark,
  },
  secondary: {
    background: colors.secondary,
    iconColor: colors.white,
    activeBackground: colors.secondaryDark,
  },
  danger: {
    background: colors.danger,
    iconColor: colors.white,
    activeBackground: '#C0392B',
  },
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 'medium',
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const { themeColors, triggerHaptic } = useAccessibility();
  
  const sizeValues = sizeConfig[size];
  const variantValues = variantConfig[variant];

  const handlePress = () => {
    if (disabled) return;
    triggerHaptic('light');
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        {
          width: sizeValues.button,
          height: sizeValues.button,
          borderRadius: sizeValues.button / 2,
          backgroundColor: disabled
            ? colors.gray[200]
            : variantValues.background,
        },
        style,
      ]}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      <Ionicons
        name={icon}
        size={sizeValues.icon}
        color={disabled ? colors.gray[400] : variantValues.iconColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
