import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ShieldCheck } from 'lucide-react-native';
import AuthScaffold from '@components/auth/AuthScaffold';
import AuthTopBar from '@components/auth/AuthTopBar';
import Button from '@components/auth/Button';
import OTPInput from '@components/auth/OTPInput';
import SectionHeader from '@components/auth/SectionHeader';
import { usePasswordReset } from '@services/auth';

/**
 * OTP verification for the password-reset flow.
 * The code entered here is *not* consumed against Clerk yet — we forward
 * it to `create-new-password` where the user supplies their new password
 * and we call `signIn.attemptFirstFactor` with `{ code, password }`.
 * Resend is wired to Clerk so users can request a fresh code.
 */
const OTPVerificationScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string; mode?: string }>();
  const { requestReset, isLoaded } = usePasswordReset();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [resending, setResending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isCodeComplete = otp.every((digit) => digit.length === 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onResend = async () => {
    if (!email) {
      setError('Missing email address. Return to Forgot Password and try again.');
      return;
    }
    setError(null);
    setBanner(null);
    setResending(true);
    const result = await requestReset(email);
    setResending(false);

    if (result.sent) {
      setBanner('A new reset code has been sent.');
      setCountdown(30);
      return;
    }
    if (result.error) {
      setError(result.error.message);
    }
  };

  const onContinue = () => {
    if (!isCodeComplete) return;
    router.push({
      pathname: '/(auth)/create-new-password',
      params: { email, code: otp.join('') },
    });
  };

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/forgot-password" />

      <SectionHeader
        title="Verify Your Identity"
        subtitle={
          email
            ? `Enter the 6-digit code sent to ${email}.`
            : 'Enter the 6-digit code sent to your email.'
        }
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

      {banner ? (
        <Text className="mt-4 text-center text-[12px] font-medium text-[#16A34A]">{banner}</Text>
      ) : null}
      {error ? (
        <Text className="mt-4 text-center text-[12px] font-medium text-[#F87171]">{error}</Text>
      ) : null}

      <View className="mt-6 flex-row items-center justify-center gap-1.5">
        <Text className="text-[13px] text-[#B7B7B7]">Didn&apos;t receive code?</Text>
        <Pressable onPress={onResend} disabled={countdown > 0 || resending || !isLoaded}>
          <Text
            className={`text-[13px] font-medium ${countdown > 0 ? 'text-[#7A7A7A]' : 'text-[#FF7A00]'}`}
          >
            Resend
          </Text>
        </Pressable>
        {countdown > 0 ? (
          <Text className="text-[13px] text-[#7A7A7A]">
            in 00:{String(countdown).padStart(2, '0')}
          </Text>
        ) : null}
      </View>

      <View className="mt-8">
        <Button label="Verify Code" onPress={onContinue} iconRight disabled={!isCodeComplete} />
      </View>
    </AuthScaffold>
  );
};

export default OTPVerificationScreen;
