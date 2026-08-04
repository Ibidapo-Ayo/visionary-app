import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface AuthTopBarProps {
  showLogo?: boolean;
  onBack?: () => void;
  fallbackHref?: Href;
}

const AuthTopBar = ({ showLogo = true, onBack, fallbackHref = '/(auth)/onboarding' }: AuthTopBarProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  };

  return (
    <View className="mt-1 flex-row items-center justify-between">
      <Pressable
        className="h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.09)] bg-[#101010]"
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2} />
      </Pressable>
      {showLogo ? <View className="h-9 w-9" /> : <View className="h-9 w-9" />}
    </View>
  );
};

export default AuthTopBar;
