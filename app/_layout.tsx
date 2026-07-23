import React, { useEffect } from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkLoaded, ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { colors } from '../lib/theme';
import 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env (see .env.example).',
  );
}

const RootLayout = () => {
  useEffect(() => {
    async function prepare() {
      try {
        try {
          await Font.loadAsync({
            'geist-sans': require('../assets/fonts/Geist-Regular.ttf'),
            'geist-sans-bold': require('../assets/fonts/Geist-Bold.ttf'),
          });
        } catch {
          console.log('[v0] Custom fonts not available');
        }
      } catch (e) {
        console.warn('[v0] Initialization error:', e);
      } finally {
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <GestureHandlerRootView className="flex-1">
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'ios_from_right',
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
            </Stack>
            <StatusBar style="light" translucent backgroundColor="transparent" />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayout;
