import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { usePasswordReset } from '@services/auth';

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
  const { code } = useLocalSearchParams<{ email?: string; code?: string }>();
  const { resetPassword, isLoaded } = usePasswordReset();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!code) {
      setFormError('Missing reset code. Restart the password reset flow.');
      return;
    }
    setFormError(null);
    const result = await resetPassword(code, values.password);

    if (result.complete) {
      router.replace('/(app)/home');
      return;
    }

    if (result.error) {
      if (result.error.field === 'password') {
        setError('password', { type: 'server', message: result.error.message });
        return;
      }
      if (result.error.code === 'form_code_incorrect' || result.error.code === 'verification_expired') {
        setFormError(`${result.error.message} Return to the previous step to request a new code.`);
        return;
      }
      setFormError(result.error.message);
    }
  };

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/otp-verification" />

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

        {formError ? (
          <Text className="text-[12px] font-medium text-[#F87171]">{formError}</Text>
        ) : null}

        <Button
          label={isSubmitting ? 'Updating…' : 'Update Password'}
          onPress={handleSubmit(onSubmit)}
          iconRight
          disabled={isSubmitting || !isLoaded}
        />
      </Animated.View>

      <Text className="mt-8 text-center text-[13px] text-[#B7B7B7]">
        After updating your password, you&apos;ll be signed in automatically.
      </Text>
    </AuthScaffold>
  );
};

export default CreateNewPasswordScreen;
