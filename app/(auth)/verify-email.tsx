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
import { useAuthSignUp } from '@services/auth';

const VerifyEmailScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { verifyEmailCode, resendEmailCode, isLoaded } = useAuthSignUp();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const isCodeComplete = otp.every((digit) => digit.length === 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onVerify = async () => {
    if (!isCodeComplete) return;
    setFormError(null);
    setBanner(null);
    setSubmitting(true);
    const result = await verifyEmailCode(otp.join(''));
    setSubmitting(false);

    if (result.complete) {
      router.replace('/(app)/home');
      return;
    }

    if (result.error) {
      setFormError(result.error.message);
    }
  };

  const onResend = async () => {
    if (countdown > 0) return;
    setFormError(null);
    setBanner(null);
    setResending(true);
    const error = await resendEmailCode();
    setResending(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setBanner('A new verification code has been sent.');
    setCountdown(30);
  };

  const busy = submitting || resending || !isLoaded;

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/register" />

      <SectionHeader
        title="Verify Your Email"
        subtitle={
          email
            ? `Enter the 6-digit code we sent to ${email}.`
            : 'Enter the 6-digit code we just sent to your email.'
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
      {formError ? (
        <Text className="mt-4 text-center text-[12px] font-medium text-[#F87171]">{formError}</Text>
      ) : null}

      <View className="mt-6 flex-row items-center justify-center gap-1.5">
        <Text className="text-[13px] text-[#B7B7B7]">Didn&apos;t receive code?</Text>
        <Pressable onPress={onResend} disabled={countdown > 0 || busy}>
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
        <Button
          label={submitting ? 'Verifying…' : 'Verify Email'}
          onPress={onVerify}
          iconRight
          disabled={!isCodeComplete || busy}
        />
      </View>
    </AuthScaffold>
  );
};

export default VerifyEmailScreen;
