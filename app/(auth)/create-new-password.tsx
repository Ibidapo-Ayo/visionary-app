import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ShieldCheck } from 'lucide-react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import AuthScaffold from '@components/auth/AuthScaffold';
import AuthTopBar from '@components/auth/AuthTopBar';
import Button from '@components/auth/Button';
import PasswordField from '@components/auth/PasswordField';
import SectionHeader from '@components/auth/SectionHeader';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Requires one uppercase letter')
      .regex(/[0-9]/, 'Requires one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const CreateNewPasswordScreen = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async () => {
    router.replace('/(auth)/login-success');
  };

  return (
    <AuthScaffold>
      <AuthTopBar />

      <SectionHeader title="Create New Password" subtitle="Your new password must be different from your previous password." />

      <Animated.View entering={FadeInUp.delay(80)} className="mt-8 items-center">
        <View className="h-36 w-36 items-center justify-center rounded-full bg-[rgba(22,163,74,0.15)]">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-[rgba(22,163,74,0.22)]">
            <ShieldCheck size={54} color="#16A34A" strokeWidth={2} />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120)} className="mt-8 gap-4">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordField
              value={value}
              onChangeText={onChange}
              placeholder="New Password"
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordField
              value={value}
              onChangeText={onChange}
              placeholder="Confirm New Password"
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button label="Update Password" onPress={handleSubmit(onSubmit)} iconRight disabled={isSubmitting} />
      </Animated.View>

      <Text className="mt-8 text-center text-[13px] text-[#B7B7B7]">
        After updating your password, you will be returned to sign in.
      </Text>
    </AuthScaffold>
  );
};

export default CreateNewPasswordScreen;
