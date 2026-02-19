/**
 * Modal Component
 * 
 * Accessibility-first modal:
 * - 60dp minimum touch targets
 * - Haptic feedback
 * - Reduced motion support
 * - Screen reader focus management
 * - High contrast mode support
 */

import { useEffect, useRef } from 'react';
import {
  View,
  Modal as RNModal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  AccessibilityInfo,
  findNodeHandle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../constants/theme';
import { Text } from './Text';
import { Button } from './Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  primaryAction?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

const sizeConfig = {
  small: { maxHeight: SCREEN_HEIGHT * 0.4 },
  medium: { maxHeight: SCREEN_HEIGHT * 0.6 },
  large: { maxHeight: SCREEN_HEIGHT * 0.85 },
  fullscreen: { maxHeight: SCREEN_HEIGHT },
};

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  size = 'medium',
  primaryAction,
  secondaryAction,
}: ModalProps) {
  const { themeColors, triggerHaptic, reducedMotion } = useAccessibility();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const contentRef = useRef<View>(null);

  useEffect(() => {
    if (visible) {
      triggerHaptic('medium');
      
      // Announce modal to screen readers
      AccessibilityInfo.announceForAccessibility(
        title ? `${title} dialog opened` : 'Dialog opened'
      );
      
      // Animate in
      if (reducedMotion) {
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 20,
            stiffness: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
      
      // Focus the modal content for screen readers
      setTimeout(() => {
        if (contentRef.current) {
          const handle = findNodeHandle(contentRef.current);
          if (handle) {
            AccessibilityInfo.setAccessibilityFocus(handle);
          }
        }
      }, 100);
    } else {
      // Animate out
      if (reducedMotion) {
        fadeAnim.setValue(0);
        slideAnim.setValue(SCREEN_HEIGHT);
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [visible, reducedMotion, title]);

  const handleClose = () => {
    triggerHaptic('light');
    AccessibilityInfo.announceForAccessibility('Dialog closed');
    onClose();
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      handleClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: fadeAnim },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={handleBackdropPress}
            activeOpacity={1}
            accessible={false}
          />
        </Animated.View>

        <Animated.View
          ref={contentRef}
          style={[
            styles.content,
            {
              backgroundColor: themeColors.background,
              maxHeight: sizeConfig[size].maxHeight,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          accessible
          accessibilityRole="alert"
          accessibilityViewIsModal
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Text variant="h2" style={{ flex: 1 }}>
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Close dialog"
                >
                  <Ionicons
                    name="close"
                    size={28}
                    color={themeColors.text}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Body */}
          <View style={styles.body}>
            {children}
          </View>

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <View style={styles.actions}>
              {secondaryAction && (
                <Button
                  title={secondaryAction.label}
                  variant="outline"
                  onPress={secondaryAction.onPress}
                  style={{ flex: 1 }}
                />
              )}
              {primaryAction && (
                <Button
                  title={primaryAction.label}
                  variant={primaryAction.variant || 'primary'}
                  onPress={primaryAction.onPress}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  closeButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    gap: spacing.md,
  },
});

export default Modal;
