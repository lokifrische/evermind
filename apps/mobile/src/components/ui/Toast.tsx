/**
 * Toast Component & Context
 * 
 * Accessible toast notifications:
 * - Screen reader announcements
 * - Haptic feedback
 * - Auto-dismiss with progress
 * - Reduced motion support
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  AccessibilityInfo,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../constants/theme';
import { Text } from './Text';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const typeConfig = {
  success: { icon: 'checkmark-circle', color: colors.success },
  error: { icon: 'close-circle', color: colors.danger },
  warning: { icon: 'warning', color: colors.warning },
  info: { icon: 'information-circle', color: colors.info },
};

interface ToastItemProps {
  toast: ToastMessage;
  onHide: () => void;
}

function ToastItem({ toast, onHide }: ToastItemProps) {
  const { themeColors, triggerHaptic, reducedMotion } = useAccessibility();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = typeConfig[toast.type];

  useEffect(() => {
    // Announce to screen readers
    AccessibilityInfo.announceForAccessibility(toast.message);
    
    // Haptic feedback
    triggerHaptic(toast.type === 'success' ? 'success' : 'warning');

    // Animate in
    if (reducedMotion) {
      translateY.setValue(0);
      opacity.setValue(1);
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 15,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Auto-dismiss
    const timer = setTimeout(() => {
      if (reducedMotion) {
        onHide();
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(onHide);
      }
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: themeColors.surface,
          borderLeftColor: config.color,
          transform: [{ translateY }],
          opacity,
        },
      ]}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons
        name={config.icon as any}
        size={24}
        color={config.color}
        style={styles.icon}
      />
      <Text variant="body" style={styles.message} numberOfLines={3}>
        {toast.message}
      </Text>
      <TouchableOpacity
        onPress={onHide}
        style={styles.closeButton}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
      >
        <Ionicons name="close" size={20} color={themeColors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 4000
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={[styles.container, { top: insets.top + spacing.md }]}>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onHide={() => hideToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
  },
  closeButton: {
    width: MIN_TOUCH_TARGET - 16,
    height: MIN_TOUCH_TARGET - 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});

export default ToastProvider;
