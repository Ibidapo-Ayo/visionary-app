import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Mail, Lock, Sparkles } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthScaffold from '@components/auth/AuthScaffold';
import AuthTopBar from '@components/auth/AuthTopBar';
import Button from '@components/auth/Button';
import SectionHeader from '@components/auth/SectionHeader';
import SupportCard from '@components/auth/SupportCard';
import TextField from '@components/auth/TextField';

const forgotSchema = z.object({
  identity: z.string().min(1, 'Email or phone is required'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { identity: '' },
  });

  const onSubmit = () => {
    router.push('/(auth)/otp-verification');
  };

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/login" />

      <SectionHeader
        title="Forgot Password?"
        subtitle="No worries! Enter your email or phone number to reset your password."
      />

      <Animated.View entering={FadeInUp.delay(80)} className="mt-8 items-center">
        <View className="relative h-40 w-40 items-center justify-center rounded-full bg-[rgba(255,122,0,0.12)]">
          <View className="absolute h-28 w-28 rounded-full bg-[rgba(255,122,0,0.18)]" />
          <View className="absolute right-7 top-7">
            <Sparkles size={18} color="#FF7A00" strokeWidth={2} />
          </View>
          <Lock size={52} color="#FF7A00" strokeWidth={2} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120)} className="mt-8 gap-4">
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
        <Button label="Send Reset Link" onPress={handleSubmit(onSubmit)} iconRight />
      </Animated.View>

      <View className="mt-8">
        <SupportCard />
      </View>
    </AuthScaffold>
  );
};

export default ForgotPasswordScreen;
