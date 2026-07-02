import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ShieldCheck } from 'lucide-react-native';
import AuthScaffold from '@components/auth/AuthScaffold';
import AuthTopBar from '@components/auth/AuthTopBar';
import Button from '@components/auth/Button';
import OTPInput from '@components/auth/OTPInput';
import SectionHeader from '@components/auth/SectionHeader';

const OTPVerificationScreen = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const isCodeComplete = otp.every((digit) => digit.length === 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/forgot-password" />

      <SectionHeader
        title="Verify Your Identity"
        subtitle="Enter the 6-digit code sent to +234 816 123 4567."
      />

      <Animated.View entering={FadeInDown.delay(80)} className="mt-8 items-center">
        <View className="h-36 w-36 items-center justify-center rounded-full bg-[rgba(22,163,74,0.15)]">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-[rgba(22,163,74,0.22)]">
            <ShieldCheck size={54} color="#16A34A" strokeWidth={2} />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120)} className="mt-10">
        <OTPInput value={otp} onChange={setOtp} />
      </Animated.View>

      <View className="mt-6 flex-row items-center justify-center gap-1.5">
        <Text className="text-[13px] text-[#B7B7B7]">Didn&apos;t receive code?</Text>
        <Pressable onPress={() => setCountdown(30)} disabled={countdown > 0}>
          <Text className={`text-[13px] font-medium ${countdown > 0 ? 'text-[#7A7A7A]' : 'text-[#FF7A00]'}`}>Resend</Text>
        </Pressable>
        <Text className="text-[13px] text-[#7A7A7A]">in 00:{String(countdown).padStart(2, '0')}</Text>
      </View>

      <View className="mt-8">
        <Button label="Verify Code" onPress={() => router.push('/(auth)/create-new-password')} iconRight disabled={!isCodeComplete} />
      </View>
    </AuthScaffold>
  );
};

export default OTPVerificationScreen;
