import type { AuthErrorShape, ClerkApiError, ClerkAuthUserResource } from '@/types/index';

/**
 * Normalized error object returned by every auth service function.
 * Screens should render `error.message` to the user; `error.code` and
 * `error.field` remain available for field-level highlighting.
 */

const FRIENDLY_MESSAGES: Record<string, string> = {
  form_identifier_not_found: 'We could not find an account for that email.',
  form_password_incorrect: 'That password is incorrect. Please try again.',
  form_password_pwned: 'That password has been compromised. Please choose another.',
  form_password_length_too_short: 'Password must be at least 8 characters long.',
  form_identifier_exists: 'An account already exists with that email.',
  form_code_incorrect: 'That verification code is incorrect. Please try again.',
  verification_expired: 'That verification code has expired. Request a new one.',
  network_error: 'Network error. Check your connection and try again.',
  session_exists: 'You are already signed in.',
};

export const toAuthError = (err: unknown): AuthErrorShape => {
  const anyErr = err as {
    errors?: ClerkApiError[];
    message?: string;
    code?: string;
  };

  const clerkError = anyErr?.errors?.[0];
  if (clerkError) {
    const code = clerkError.code ?? 'unknown_error';
    return {
      code,
      message: FRIENDLY_MESSAGES[code] ?? clerkError.longMessage ?? clerkError.message ?? 'Something went wrong. Please try again.',
      field: clerkError.meta?.paramName,
    };
  }

  return {
    code: anyErr?.code ?? 'unknown_error',
    message: anyErr?.message ?? 'Something went wrong. Please try again.',
  };
};

/**
 * Extracts the pieces of a Clerk `UserResource` used across the app UI
 * so screens never depend on Clerk types directly.
 */
export const mapClerkUser = (user: ClerkAuthUserResource | null | undefined) => {
  if (!user) return null;

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? '';
  const primaryPhone =
    user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers?.[0]?.phoneNumber ?? '';

  return {
    id: user.id,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: primaryEmail,
    phone: primaryPhone,
    profileImage: user.imageUrl ?? undefined,
    joinDate: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
  };
};

