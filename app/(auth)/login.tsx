import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail } from 'lucide-react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import AuthScaffold from '@components/auth/AuthScaffold';
import AuthTopBar from '@components/auth/AuthTopBar';
import Button from '@components/auth/Button';
import PasswordField from '@components/auth/PasswordField';
import SectionHeader from '@components/auth/SectionHeader';
import SocialButton from '@components/auth/SocialButton';
import TextField from '@components/auth/TextField';
import { useAuthSignIn, useGoogleAuth, useSyncUserToBackend } from '@services/auth';

const signInSchema = z.object({
  identity: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

type SignInForm = z.infer<typeof signInSchema>;

const LoginScreen = () => {
  const router = useRouter();
  const { doSignIn, isLoaded } = useAuthSignIn();
  const { syncUserToBackend } = useSyncUserToBackend();
  const { signInWithGoogle } = useGoogleAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identity: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInForm) => {
    setFormError(null);
    setSubmitting(true);
    const result = await doSignIn({
      identifier: values.identity,
      password: values.password,
    });
    setSubmitting(false);

    if (result.complete) {
      setFinalizing(true);
      const finalizeResult = await syncUserToBackend();
      setFinalizing(false);

      if (finalizeResult.complete) {
        router.replace('/(app)/home');
        return;
      }

      if (finalizeResult.error) {
        setFormError(finalizeResult.error.message);
      }
      return;
    }

    if (result.error) {
      setFormError(result.error.message);
    }
  };

  const onGoogle = async () => {
    setFormError(null);
    setGoogleSubmitting(true);
    const result = await signInWithGoogle();
    setGoogleSubmitting(false);
    if (result.complete) {
      setFinalizing(true);
      const finalizeResult = await syncUserToBackend();
      setFinalizing(false);

      if (finalizeResult.complete) {
        router.replace('/(app)/home');
        return;
      }

      if (finalizeResult.error) {
        setFormError(finalizeResult.error.message);
      }
      return;
    }
    if (result.error) {
      setFormError(result.error.message);
    }
  };

  const busy = submitting || googleSubmitting || finalizing || !isLoaded;

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/onboarding" />

      <SectionHeader title="Welcome back!" subtitle="Sign in to continue your spiritual journey." />

      <Animated.View entering={FadeInDown.delay(80)} className="mt-8 gap-4">
        <Controller
          control={control}
          name="identity"
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              onChangeText={onChange}
              placeholder="Email or Phone Number"
              icon={Mail}
              error={errors.identity?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordField
              value={value}
              onChangeText={onChange}
              placeholder="Password"
              error={errors.password?.message}
            />
          )}
        />

        <Pressable onPress={() => router.push('/(auth)/forgot-password')} className="items-end">
          <Text className="text-[13px] font-medium text-[#FF7A00]">Forgot Password?</Text>
        </Pressable>

        <Button label={finalizing ? 'Finalizing account…' : 'Sign In'} onPress={handleSubmit(onSubmit)} iconRight disabled={busy} />
      </Animated.View>

      {formError ? (
        <Text className="mt-4 text-[12px] font-medium text-[#F87171]">{formError}</Text>
      ) : null}

      <View className="mt-7 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-[rgba(255,255,255,0.12)]" />
        <Text className="text-[13px] text-[#B7B7B7]">or continue with</Text>
        <View className="h-px flex-1 bg-[rgba(255,255,255,0.12)]" />
      </View>

      <Animated.View entering={FadeInDown.delay(120)} className="mt-5">
        <SocialButton brand="google" layout="full" onPress={onGoogle} />
      </Animated.View>

      <View className="mt-8 flex-row items-center justify-center gap-1.5">
        <Text className="text-[13px] text-[#B7B7B7]">Don&apos;t have an account?</Text>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text className="text-[13px] font-semibold text-[#FF7A00]">Sign Up</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
};

export default LoginScreen;
