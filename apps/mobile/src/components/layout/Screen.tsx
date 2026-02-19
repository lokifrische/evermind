/**
 * Screen Layout Component
 * 
 * Provides consistent screen structure:
 * - Safe area handling
 * - Background color based on theme
 * - Optional header with back button
 * - Scroll view with pull-to-refresh support
 * - Persistent microphone button (voice commands)
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Text } from '../ui/Text';
import {
  spacing,
  colors,
  MIN_TOUCH_TARGET,
} from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showMic?: boolean;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onMicPress?: () => void;
  backgroundColor?: string;
  padded?: boolean;
}

export function Screen({
  children,
  title,
  showBack = false,
  showMic = true,
  scrollable = true,
  refreshing = false,
  onRefresh,
  onMicPress,
  backgroundColor,
  padded = true,
}: ScreenProps) {
  const { themeColors, triggerHaptic, highContrast, theme } = useAccessibility();
  const router = useRouter();

  const bgColor = backgroundColor || themeColors.background;
  const statusBarStyle = theme === 'dark' || highContrast ? 'light-content' : 'dark-content';

  const handleBack = () => {
    triggerHaptic('light');
    router.back();
  };

  const handleMicPress = () => {
    triggerHaptic('medium');
    onMicPress?.();
  };

  const renderHeader = () => {
    if (!title && !showBack) return null;

    return (
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={themeColors.text}
            />
            <Text variant="body" weight="medium" style={{ marginLeft: spacing.xs }}>
              Back
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        {title && (
          <Text variant="h2" center style={styles.headerTitle}>
            {title}
          </Text>
        )}

        {/* Spacer for symmetry */}
        <View style={styles.backButton} />
      </View>
    );
  };

  const content = (
    <>
      {renderHeader()}
      <View style={[styles.content, padded && styles.padded]}>
        {children}
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={bgColor}
      />

      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={themeColors.text}
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.nonScrollContent}>
          {content}
        </View>
      )}

      {/* Persistent microphone button - per spec */}
      {showMic && (
        <TouchableOpacity
          onPress={handleMicPress}
          style={[
            styles.micButton,
            {
              backgroundColor: highContrast ? colors.white : colors.assistant.main,
              borderColor: highContrast ? colors.black : 'transparent',
              borderWidth: highContrast ? 2 : 0,
            },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Voice commands"
          accessibilityHint="Tap to speak a command"
        >
          <Ionicons
            name="mic"
            size={28}
            color={highContrast ? colors.black : colors.white}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  nonScrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: MIN_TOUCH_TARGET,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'flex-start',
  },
  headerTitle: {
    flex: 1,
  },
  micButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80, // Above bottom nav
    right: spacing.lg,
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default Screen;
