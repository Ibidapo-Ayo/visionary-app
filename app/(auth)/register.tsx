import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAuthStore } from '@store/authStore';
import Button from '@components/Button';
import Card from '@components/Card';
import { z } from 'zod';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  password: z.string().min(6, 'Password must be 6+ characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegistrationData = z.infer<typeof registrationSchema>;

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

  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [generalError, setGeneralError] = useState('');

  const handleRegister = async () => {
    setErrors({});
    setGeneralError('');

    try {
      const validatedData = registrationSchema.parse(formData);
      await register(validatedData);
      router.replace('/(app)/home');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<RegistrationData> = {};
        err.errors.forEach((error) => {
          const path = error.path[0] as keyof RegistrationData;
          newErrors[path] = { message: error.message } as any;
        });
        setErrors(newErrors);
      } else {
        setGeneralError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn.duration(400)}>
          <Text style={styles.logo}>VISIONARY</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={styles.formContainer}
          entering={SlideInUp.duration(600)}
        >
          <Card variant="outlined">
            {/* First Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor="#64748b"
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                editable={!isLoading}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName?.message}</Text>
              )}
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#64748b"
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
                editable={!isLoading}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName?.message}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#64748b"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email?.message}</Text>
              )}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#64748b"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone?.message}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password?.message}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry
                editable={!isLoading}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword?.message}</Text>
              )}
            </View>

            {/* General Error */}
            {generalError && (
              <Animated.View
                style={styles.errorContainer}
                entering={FadeIn.duration(300)}
              >
                <Text style={styles.generalErrorText}>{generalError}</Text>
              </Animated.View>
            )}

            {/* Register Button */}
            <Button
              onPress={handleRegister}
              title="Create Account"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              style={styles.button}
            />
          </Card>
        </Animated.View>

        {/* Login Link */}
        <Animated.View style={styles.loginContainer} entering={FadeIn.duration(800)}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fbbf24',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '300',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#64748b',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  generalErrorText: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  loginLink: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
