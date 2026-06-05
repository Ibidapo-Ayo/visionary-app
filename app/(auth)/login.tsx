import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Button from '@components/Button';
import Card from '@components/Card';
import GlassInput from '@components/GlassInput';
import ScreenBackground from '@components/ScreenBackground';
import { colors, spacing, typography } from '../../lib/theme';

const LoginScreen = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(app)/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.header} entering={FadeIn}>
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>Step into your spiritual command center</Text>
            <Text style={styles.caption}>Sign in to continue your journey with the Visionary community.</Text>
          </Animated.View>

          <Animated.View style={styles.formContainer} entering={SlideInUp.duration(280)}>
            <Card variant="elevated" blurVariant="strong" padding="lg">
              <View style={styles.formStack}>
                <GlassInput
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <GlassInput
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  rightNode={(
                    <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                      <MaterialCommunityIcons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        color={colors.textSecondary}
                        size={18}
                      />
                    </TouchableOpacity>
                  )}
                />
                {!!error && <Text style={styles.error}>{error}</Text>}

                <Button onPress={handleLogin} title="Sign In" loading={isLoading} disabled={isLoading} fullWidth />
              </View>
            </Card>
          </Animated.View>

          <Animated.View style={styles.registerRow} entering={FadeIn.delay(120)}>
            <Text style={styles.registerText}>New here?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Create account</Text>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.accentGold,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    marginBottom: spacing.lg,
  },
  formStack: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: typography.bodySm.fontSize,
  },
  registerLink: {
    color: colors.accentTeal,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '700',
  },
});

export default LoginScreen;
