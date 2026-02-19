/**
 * Accessible Text Component
 * 
 * - Automatically scales with accessibility font settings
 * - Supports semantic variants
 * - High contrast mode aware
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { fontSizes, fontWeights } from '../../constants/theme';

type TextVariant = 
  | 'h1'      // Page titles
  | 'h2'      // Section titles
  | 'h3'      // Card titles
  | 'body'    // Body text
  | 'bodyLarge' // Larger body text
  | 'caption' // Small captions
  | 'label';  // Form labels

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof fontWeights;
  center?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, { size: number; weight: keyof typeof fontWeights }> = {
  h1: { size: fontSizes['3xl'], weight: 'bold' },
  h2: { size: fontSizes['2xl'], weight: 'semibold' },
  h3: { size: fontSizes.xl, weight: 'semibold' },
  bodyLarge: { size: fontSizes.lg, weight: 'normal' },
  body: { size: fontSizes.base, weight: 'normal' },
  caption: { size: fontSizes.sm, weight: 'normal' },
  label: { size: fontSizes.sm, weight: 'medium' },
};

export function Text({
  variant = 'body',
  color,
  weight,
  center,
  style,
  children,
  ...props
}: TextProps) {
  const { scaledFontSize, themeColors, highContrast } = useAccessibility();
  
  const variantStyle = variantStyles[variant];
  const fontSize = scaledFontSize(variantStyle.size);
  const fontWeight = fontWeights[weight || variantStyle.weight];
  const textColor = color || themeColors.text;

  return (
    <RNText
      style={[
        styles.base,
        {
          fontSize,
          fontWeight,
          color: textColor,
          textAlign: center ? 'center' : undefined,
          // High contrast: ensure maximum legibility
          letterSpacing: highContrast ? 0.5 : 0,
        },
        style,
      ]}
      // Accessibility
      accessible
      accessibilityRole={variant.startsWith('h') ? 'header' : 'text'}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    // Ensure text doesn't get cut off
    includeFontPadding: false,
  },
});

export default Text;
