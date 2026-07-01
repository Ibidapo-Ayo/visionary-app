import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface AuthTopBarProps {
  showLogo?: boolean;
  onBack?: () => void;
}

const AuthTopBar = ({ showLogo = true, onBack }: AuthTopBarProps) => {
  const router = useRouter();

  return (
    <View className="mt-1 flex-row items-center justify-between">
      <Pressable
        className="h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.09)] bg-[#101010]"
        onPress={onBack ?? (() => router.back())}
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
