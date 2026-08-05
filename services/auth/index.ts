export { toAuthError, mapClerkUser } from './errors';
export type { AuthErrorShape } from '@/types/index';

export { useAuthSignUp } from './useAuthSignUp';
export type { SignUpInput, SignUpResult } from '@/types/index';

export { useAuthSignIn } from './useAuthSignIn';
export type { SignInInput, SignInResult } from '@/types/index';

export { usePasswordReset } from './usePasswordReset';
export type { RequestResetResult, CompleteResetResult } from '@/types/index';

export { useGoogleAuth } from './useGoogleAuth';
export type { OAuthResult } from '@/types/index';

export { useSyncClerkAuth } from './useSyncClerkAuth';
export { useSignOut } from './useSignOut';
export type { SignOutResult } from '@/types/index';
