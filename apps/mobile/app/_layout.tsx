/**
 * Root Layout
 * 
 * Sets up:
 * - Accessibility provider
 * - Safe area provider
 * - Navigation container
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AccessibilityProvider } from '../src/contexts/AccessibilityContext';
import { DataProvider } from '../src/contexts/DataContext';
import { ServicesProvider } from '../src/contexts/ServicesContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AccessibilityProvider>
          <DataProvider>
            <ServicesProvider>
              <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="memories/[id]"
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="family/[id]"
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="games/[game]"
              options={{
                presentation: 'card',
              }}
            />
              </Stack>
              <StatusBar style="auto" />
            </ServicesProvider>
          </DataProvider>
        </AccessibilityProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
