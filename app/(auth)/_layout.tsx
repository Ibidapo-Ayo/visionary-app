import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useSyncClerkAuth } from '@services/auth';
import { useAppStore } from '@store/appStore';

const AuthLayout = () => {
  useSyncClerkAuth();
  const { isLoaded, isSignedIn } = useAuth();
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);

  // While Clerk is booting, keep splash logic in charge (index redirects here).
  if (!isLoaded) {
    return null;
  }

  // If the user already has a valid Clerk session, skip auth entirely.
  if (isSignedIn) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
      // Prevent a brief flash of the splash for returning users.
      initialRouteName={isOnboardingComplete ? 'login' : 'splash'}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="create-new-password" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
};

export default AuthLayout;
