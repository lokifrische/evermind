/**
 * Tab Navigation Layout
 * 
 * Per spec:
 * - Persistent bottom navigation bar
 * - Center Home button visible on every screen
 * - No hamburger menus, no drawers
 * - 60dp minimum touch targets
 */

import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import {
  colors,
  MIN_TOUCH_TARGET,
  spacing,
} from '../../src/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabBarIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as IconName)}
        size={28}
        color={color}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { themeColors, highContrast, triggerHaptic } = useAccessibility();

  const activeColor = highContrast ? colors.white : colors.memories.main;
  const inactiveColor = highContrast ? colors.gray[400] : colors.gray[500];
  const backgroundColor = highContrast ? colors.black : themeColors.background;
  const borderColor = highContrast ? colors.white : colors.gray[200];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => triggerHaptic('light'),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="images" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => triggerHaptic('light'),
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="people" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => triggerHaptic('light'),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="game-controller" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => triggerHaptic('light'),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Talk to Me',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="chatbubbles" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => triggerHaptic('light'),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: MIN_TOUCH_TARGET,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
