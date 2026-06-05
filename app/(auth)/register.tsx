import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import Button from '@components/Button';
import Card from '@components/Card';
import GlassInput from '@components/GlassInput';
import ScreenBackground from '@components/ScreenBackground';
import { z } from 'zod';
import { colors, spacing, typography } from '../../lib/theme';

const registrationSchema = z
  .object({
    firstName: z.string().min(2, 'First name required'),
    lastName: z.string().min(2, 'Last name required'),
    email: z.string().email('Valid email required'),
    phone: z.string().min(10, 'Valid phone required'),
    password: z.string().min(6, 'Password must be 6+ characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegistrationData = z.infer<typeof registrationSchema>;
type RegistrationErrors = Partial<Record<keyof RegistrationData, string>>;

const RegisterScreen = () => {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [generalError, setGeneralError] = useState('');

  const updateField = (field: keyof RegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setErrors({});
    setGeneralError('');

    try {
      const validatedData = registrationSchema.parse(formData);
      await register(validatedData);
      router.replace('/(app)/home');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const nextErrors: RegistrationErrors = {};
        err.errors.forEach((issue) => {
          const key = issue.path[0] as keyof RegistrationData;
          nextErrors[key] = issue.message;
        });
        setErrors(nextErrors);
        return;
      }
      setGeneralError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.header} entering={FadeIn}>
            <Text style={styles.eyebrow}>Join Visionary</Text>
            <Text style={styles.title}>Create your ministry identity</Text>
            <Text style={styles.caption}>We’ll personalize your spiritual dashboard in a few secure steps.</Text>
          </Animated.View>

          <Animated.View style={styles.formContainer} entering={SlideInUp.duration(300)}>
            <Card variant="elevated" blurVariant="strong" padding="lg">
              <View style={styles.formGrid}>
                <GlassInput label="First name" placeholder="John" value={formData.firstName} onChangeText={(v) => updateField('firstName', v)} error={errors.firstName} editable={!isLoading} />
                <GlassInput label="Last name" placeholder="Doe" value={formData.lastName} onChangeText={(v) => updateField('lastName', v)} error={errors.lastName} editable={!isLoading} />
                <GlassInput label="Email" placeholder="you@example.com" value={formData.email} onChangeText={(v) => updateField('email', v)} error={errors.email} editable={!isLoading} autoCapitalize="none" keyboardType="email-address" />
                <GlassInput label="Phone" placeholder="+1 (555) 123-4567" value={formData.phone} onChangeText={(v) => updateField('phone', v)} error={errors.phone} editable={!isLoading} keyboardType="phone-pad" />
                <GlassInput label="Password" placeholder="••••••••" value={formData.password} onChangeText={(v) => updateField('password', v)} error={errors.password} editable={!isLoading} secureTextEntry />
                <GlassInput label="Confirm password" placeholder="••••••••" value={formData.confirmPassword} onChangeText={(v) => updateField('confirmPassword', v)} error={errors.confirmPassword} editable={!isLoading} secureTextEntry />

                {!!generalError && <Text style={styles.error}>{generalError}</Text>}
                <Button onPress={handleRegister} title="Create Account" loading={isLoading} disabled={isLoading} fullWidth />
              </View>
            </Card>
          </Animated.View>

          <Animated.View style={styles.footer} entering={FadeIn.delay(120)}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  eyebrow: {
    color: colors.accentGold,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  caption: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  formContainer: {
    marginBottom: spacing.md,
  },
  formGrid: {
    gap: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.md,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  footerLink: {
    color: colors.accentTeal,
    fontWeight: '700',
    fontSize: typography.bodySm.fontSize,
  },
});

export default RegisterScreen;
