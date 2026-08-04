import React from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthScaffoldProps {
  children: React.ReactNode;
  scroll?: boolean;
}

const AuthScaffold = ({ children, scroll = true }: AuthScaffoldProps) => {
  if (!scroll) {
    return (
      <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="absolute left-[-42px] top-[120px] h-[180px] w-[180px] rounded-full bg-[rgba(255,122,0,0.10)]" />
        <View className="absolute right-[-56px] top-[44%] h-[220px] w-[220px] rounded-full bg-[rgba(255,122,0,0.06)]" />
        {children}
      </View>
    </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 px-6" contentContainerClassName="pb-8" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
    </SafeAreaView>
  );
};

export default AuthScaffold;
