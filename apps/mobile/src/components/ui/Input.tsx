/**
 * Input Component
 * 
 * Accessibility-first text input:
 * - 60dp minimum height for touch target
 * - Font scaling support
 * - High contrast mode support
 * - Clear button for easy clearing
 * - Voice input integration ready
 */

import { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET, typography } from '../../constants/theme';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showClearButton?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showClearButton = true,
  style,
  inputStyle,
  value,
  onChangeText,
  placeholder,
  ...props
}, ref) => {
  const { themeColors, scaledFontSize, triggerHaptic } = useAccessibility();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    triggerHaptic('light');
    onChangeText?.('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.({} as any);
  };

  const showClear = showClearButton && value && value.length > 0;

  const borderColor = error
    ? colors.danger
    : isFocused
      ? colors.primary
      : themeColors.border;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="caption" weight="semibold" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: themeColors.surface,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={leftIcon}
              size={24}
              color={themeColors.textSecondary}
            />
          </View>
        )}
        
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={themeColors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: themeColors.text,
              fontSize: scaledFontSize(typography.body.fontSize),
            },
            leftIcon && { paddingLeft: 0 },
            (showClear || rightIcon) && { paddingRight: 0 },
            inputStyle,
          ]}
          accessible
          accessibilityLabel={label || placeholder}
          accessibilityHint={hint}
          accessibilityState={{ disabled: props.editable === false }}
          {...props}
        />
        
        {showClear && !rightIcon && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.iconContainer}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Clear input"
          >
            <Ionicons
              name="close-circle"
              size={24}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconContainer}
            disabled={!onRightIconPress}
            accessible
            accessibilityRole={onRightIconPress ? 'button' : 'none'}
          >
            <Ionicons
              name={rightIcon}
              size={24}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || hint) && (
        <Text
          variant="caption"
          color={error ? colors.danger : themeColors.textSecondary}
          style={styles.helperText}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.body.fontFamily,
  },
  iconContainer: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;
