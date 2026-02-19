/**
 * Accessibility Context
 * 
 * Provides app-wide accessibility settings:
 * - Font scale (4 levels)
 * - High contrast mode
 * - Reduced motion
 * - Theme (light/dark)
 * - Haptic feedback toggle
 * - Audio feedback toggle
 * 
 * Settings are persisted to device storage and loaded on app start.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { fontScales, colors } from '../constants/theme';

// Storage key for persisted settings
const STORAGE_KEY = '@evermind/accessibility-settings';

// Font scale options
export type FontScaleKey = 'small' | 'medium' | 'large' | 'extraLarge';

// Theme options
export type ThemeMode = 'light' | 'dark' | 'highContrast';

interface AccessibilitySettings {
  fontScale: FontScaleKey;
  theme: ThemeMode;
  highContrast: boolean;
  reducedMotion: boolean;
  hapticsEnabled: boolean;
  audioFeedbackEnabled: boolean;
  voiceSpeed: number; // 0.5 to 2.0
}

interface AccessibilityContextValue extends AccessibilitySettings {
  // Computed values
  fontScaleValue: number;
  themeColors: typeof colors.light;
  animationDuration: (base: number) => number;
  
  // State
  isLoaded: boolean;
  
  // Actions
  setFontScale: (scale: FontScaleKey) => void;
  setTheme: (theme: ThemeMode) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setAudioFeedbackEnabled: (enabled: boolean) => void;
  setVoiceSpeed: (speed: number) => void;
  resetToDefaults: () => void;
  
  // Utilities
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
  scaledFontSize: (baseSize: number) => number;
}

const defaultSettings: AccessibilitySettings = {
  fontScale: 'medium',
  theme: 'light',
  highContrast: false,
  reducedMotion: false,
  hapticsEnabled: true,
  audioFeedbackEnabled: true,
  voiceSpeed: 1.0,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to storage whenever they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveSettings(settings);
    }
  }, [settings, isLoaded]);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
        // Merge with defaults to handle any missing keys from older versions
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSettings = async (newSettings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  };

  // Computed font scale value
  const fontScaleValue = useMemo(() => fontScales[settings.fontScale], [settings.fontScale]);

  // Computed theme colors
  const themeColors = useMemo(() => {
    if (settings.highContrast) return colors.highContrast;
    return settings.theme === 'dark' ? colors.dark : colors.light;
  }, [settings.theme, settings.highContrast]);

  // Animation duration respecting reduced motion
  const animationDuration = useCallback((base: number) => {
    return settings.reducedMotion ? 0 : base;
  }, [settings.reducedMotion]);

  // Scaled font size
  const scaledFontSize = useCallback((baseSize: number) => {
    return Math.round(baseSize * fontScaleValue);
  }, [fontScaleValue]);

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (!settings.hapticsEnabled) return;
    
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  }, [settings.hapticsEnabled]);

  // Setters
  const setFontScale = useCallback((scale: FontScaleKey) => {
    setSettings(prev => ({ ...prev, fontScale: scale }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, highContrast: enabled }));
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, reducedMotion: enabled }));
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, hapticsEnabled: enabled }));
  }, []);

  const setAudioFeedbackEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, audioFeedbackEnabled: enabled }));
  }, []);

  const setVoiceSpeed = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, voiceSpeed: Math.max(0.5, Math.min(2.0, speed)) }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const value = useMemo(() => ({
    ...settings,
    fontScaleValue,
    themeColors,
    animationDuration,
    isLoaded,
    setFontScale,
    setTheme,
    setHighContrast,
    setReducedMotion,
    setHapticsEnabled,
    setAudioFeedbackEnabled,
    setVoiceSpeed,
    resetToDefaults,
    triggerHaptic,
    scaledFontSize,
  }), [
    settings,
    fontScaleValue,
    themeColors,
    animationDuration,
    isLoaded,
    setFontScale,
    setTheme,
    setHighContrast,
    setReducedMotion,
    setHapticsEnabled,
    setAudioFeedbackEnabled,
    setVoiceSpeed,
    resetToDefaults,
    triggerHaptic,
    scaledFontSize,
  ]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

export default AccessibilityContext;
