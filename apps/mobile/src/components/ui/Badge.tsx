/**
 * Badge Component
 * 
 * Accessible badge/chip component:
 * - Font scaling support
 * - High contrast mode support
 * - Various color variants
 */

import { View, StyleSheet } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { colors, spacing, typography } from '../../constants/theme';
import { Text } from './Text';

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  outline?: boolean;
}

const variantColors = {
  default: { bg: colors.gray[200], text: colors.gray[700], border: colors.gray[400] },
  primary: { bg: colors.primary, text: colors.white, border: colors.primary },
  secondary: { bg: colors.secondary, text: colors.white, border: colors.secondary },
  success: { bg: colors.success, text: colors.white, border: colors.success },
  warning: { bg: colors.warning, text: colors.gray[900], border: colors.warning },
  danger: { bg: colors.danger, text: colors.white, border: colors.danger },
  info: { bg: colors.info, text: colors.white, border: colors.info },
};

const sizeConfig = {
  small: { paddingH: spacing.sm, paddingV: 2, fontSize: typography.caption.fontSize },
  medium: { paddingH: spacing.md, paddingV: spacing.xs, fontSize: typography.body.fontSize },
  large: { paddingH: spacing.lg, paddingV: spacing.sm, fontSize: typography.bodyLarge.fontSize },
};

export function Badge({
  label,
  variant = 'default',
  size = 'medium',
  outline = false,
}: BadgeProps) {
  const { scaledFontSize } = useAccessibility();
  const colorValues = variantColors[variant];
  const sizeValues = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: outline ? 'transparent' : colorValues.bg,
          borderColor: colorValues.border,
          borderWidth: outline ? 1.5 : 0,
          paddingHorizontal: sizeValues.paddingH,
          paddingVertical: sizeValues.paddingV,
        },
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text
        style={{
          fontSize: scaledFontSize(sizeValues.fontSize),
          color: outline ? colorValues.border : colorValues.text,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});

export default Badge;
