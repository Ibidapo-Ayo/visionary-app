export { toAuthError, mapClerkUser } from './errors';
export type { AuthErrorShape } from './errors';

export { useAuthSignUp } from './useAuthSignUp';
export type { SignUpInput, SignUpResult } from './useAuthSignUp';

export { useAuthSignIn } from './useAuthSignIn';
export type { SignInInput, SignInResult } from './useAuthSignIn';

export { usePasswordReset } from './usePasswordReset';
export type { RequestResetResult, CompleteResetResult } from './usePasswordReset';

export { useGoogleAuth } from './useGoogleAuth';
export type { OAuthResult } from './useGoogleAuth';

export { useSyncClerkAuth } from './useSyncClerkAuth';
export { useSignOut } from './useSignOut';
export type { SignOutResult } from './useSignOut';
