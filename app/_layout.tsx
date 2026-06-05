import React, { useEffect } from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@store/authStore';
import 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const loadUser = useAuthStore((state) => state.loadUser);

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

        await loadUser();
      } catch (e) {
        console.warn('[v0] Initialization error:', e);
      } finally {
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'ios_from_right',
            contentStyle: { backgroundColor: '#060B1B' },
          }}
        >
          <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
        </Stack>
        <StatusBar style="light" translucent backgroundColor="transparent" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
