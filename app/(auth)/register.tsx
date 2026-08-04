import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mail, Phone, User } from 'lucide-react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import AuthScaffold from '@components/auth/AuthScaffold';
import AuthTopBar from '@components/auth/AuthTopBar';
import Button from '@components/auth/Button';
import PasswordField from '@components/auth/PasswordField';
import PasswordRequirementCard, { getPasswordRequirements } from '@components/auth/PasswordRequirementCard';
import SectionHeader from '@components/auth/SectionHeader';
import SocialButton from '@components/auth/SocialButton';
import TextField from '@components/auth/TextField';
import { useAuthSignUp, useGoogleAuth } from '@services/auth';

const registrationSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('A valid email is required'),
    phone: z.string().refine((value) => {
      const trimmed = value.trim();
      return trimmed.length === 0 || trimmed.length >= 10;
    }, {
        message: 'Phone number must be at least 10 digits when provided',
      }),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Requires one uppercase letter')
      .regex(/[0-9]/, 'Requires one number'),
  })
  .strict();

type RegistrationData = z.infer<typeof registrationSchema>;

const RegisterScreen = () => {
  const router = useRouter();
  const { startSignUp, isLoaded } = useAuthSignUp();
  const { signInWithGoogle } = useGoogleAuth();

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const handleRegister = async (values: RegistrationData) => {
    setFormError(null);
    const names = values.fullName.trim().split(' ');
    const firstName = names[0] ?? values.fullName;
    const lastName = names.slice(1).join(' ') || firstName;

    setSubmitting(true);
    const result = await startSignUp({
      firstName,
      lastName,
      emailAddress: values.email,
      phone: values.phone.trim() || undefined,
      password: values.password,
    });
    setSubmitting(false);

    if (result.needsEmailVerification) {
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: values.email },
      });
      return;
    }

    if (result.complete) {
      router.replace('/(app)/home');
      return;
    }

    if (result.error) {
      const field = result.error.field;
      if (field === 'email_address' || field === 'emailAddress') {
        setError('email', { type: 'server', message: result.error.message });
        return;
      }
      if (field === 'password') {
        setError('password', { type: 'server', message: result.error.message });
        return;
      }
      setFormError(result.error.message);
    }
  };

  const onGoogle = async () => {
    setFormError(null);
    setGoogleSubmitting(true);
    const result = await signInWithGoogle();
    setGoogleSubmitting(false);
    if (result.complete) {
      router.replace('/(app)/home');
      return;
    }
    if (result.error) {
      setFormError(result.error.message);
    }
  };

  const busy = submitting || googleSubmitting || !isLoaded;
  const passwordValue = watch('password') ?? '';
  const isPasswordValid = getPasswordRequirements(passwordValue).every((requirement) => requirement.met);

  return (
    <AuthScaffold>
      <AuthTopBar fallbackHref="/(auth)/login" />

      <SectionHeader title="Create Account" subtitle="Let&apos;s get you started on your spiritual journey." />

      <Animated.View entering={FadeInDown.delay(80)} className="mt-8 gap-4">
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <TextField value={value} onChangeText={onChange} placeholder="Full Name" icon={User} error={errors.fullName?.message} />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              onChangeText={onChange}
              placeholder="Email Address"
              icon={Mail}
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              onChangeText={onChange}
              placeholder="Phone Number (Optional)"
              icon={Phone}
              keyboardType="phone-pad"
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordField value={value} onChangeText={onChange} placeholder="Password" error={errors.password?.message} />
          )}
        />

        <PasswordRequirementCard password={passwordValue} />

        {formError ? (
          <Text className="text-[12px] font-medium text-[#F87171]">{formError}</Text>
        ) : null}

        {/* Clerk bot-protection captcha target (required for sign-up) */}
        <View nativeID="clerk-captcha" />

        <Button
          label={submitting ? 'Creating account…' : 'Sign Up'}
          onPress={handleSubmit(handleRegister)}
          iconRight
          disabled={busy || !isPasswordValid}
        />
      </Animated.View>

      <View className="mt-7 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-[rgba(255,255,255,0.12)]" />
        <Text className="text-[13px] text-[#B7B7B7]">or continue with</Text>
        <View className="h-px flex-1 bg-[rgba(255,255,255,0.12)]" />
      </View>

      <Animated.View entering={FadeInDown.delay(120)} className="mt-5">
        <SocialButton brand="google" layout="full" onPress={onGoogle} />
      </Animated.View>

      <View className="mt-8 flex-row items-center justify-center gap-1.5">
        <Text className="text-[13px] text-[#B7B7B7]">Already have an account?</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text className="text-[13px] font-semibold text-[#FF7A00]">Sign In</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
};

export default RegisterScreen;
