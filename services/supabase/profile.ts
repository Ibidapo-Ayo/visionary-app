import type { ClerkUserResource, SupabaseUserRow, User } from '@/types/index';
import { supabase } from './client';
import { USERS_TABLE } from './constants';

const getPrimaryEmail = (user: ClerkUserResource): string =>
  user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '';

const getPrimaryPhone = (user: ClerkUserResource): string =>
  user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers[0]?.phoneNumber ?? '';

const getMetadataPhone = (user: ClerkUserResource): string => {
  const metadataValue = user.unsafeMetadata?.phone_number;
  return typeof metadataValue === 'string' ? metadataValue : '';
};

const toNullable = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const nowIso = (): string => new Date().toISOString();

const getDeviceTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

const normalizeRoleForSupabase = (role: string | null | undefined): string => {
  const normalized = (role ?? '').trim().toUpperCase();

  switch (normalized) {
    case 'MEMBER':
      return 'member';
    case 'STEWARD':
      return 'steward';
    case 'LEADER':
      return 'leader';
    case 'ADMIN':
      return 'admin';
    case 'SUPER_ADMIN':
      return 'super_admin';
    default:
      // Default to member to avoid DB constraint failures on unknown values.
      return 'member';
  }
};

const baseRowFromClerk = (user: ClerkUserResource, existing?: SupabaseUserRow | null): SupabaseUserRow => {
  const now = nowIso();
  const createdAt = user.createdAt ? new Date(user.createdAt).toISOString() : now;
  const phoneFromClerk = toNullable(getPrimaryPhone(user));
  const phoneFromMetadata = toNullable(getMetadataPhone(user));

  return {
    id: existing?.id,
    clerk_user_id: user.id,
    created_at: existing?.created_at ?? createdAt,
    updated_at: now,
    email: toNullable(getPrimaryEmail(user)) ?? existing?.email ?? null,
    first_name: toNullable(user.firstName) ?? existing?.first_name ?? null,
    last_name: toNullable(user.lastName) ?? existing?.last_name ?? null,
    // Preserve a previously saved phone number when Clerk does not have one.
    phone_number: phoneFromClerk ?? phoneFromMetadata ?? existing?.phone_number ?? null,
    profile_image: toNullable(user.imageUrl) ?? existing?.profile_image ?? null,
    gender: existing?.gender ?? null,
    date_of_birth: existing?.date_of_birth ?? null,
    role: normalizeRoleForSupabase(existing?.role ?? 'MEMBER'),
    department: existing?.department ?? null,
    joined_at: existing?.joined_at ?? createdAt,
    is_active: existing?.is_active ?? true,
    // Refresh on every sync so a user's streak always uses their current device's timezone.
    timezone: getDeviceTimezone(),
  };
};

const baseRowFromStoreUser = (user: User, existing?: SupabaseUserRow | null): SupabaseUserRow => ({
  id: existing?.id,
  clerk_user_id: user.id,
  created_at: existing?.created_at ?? user.createdAt,
  updated_at: user.updatedAt,
  email: toNullable(user.email) ?? existing?.email ?? null,
  first_name: toNullable(user.firstName) ?? existing?.first_name ?? null,
  last_name: toNullable(user.lastName) ?? existing?.last_name ?? null,
  phone_number: toNullable(user.phone),
  profile_image: toNullable(user.profileImage),
  gender: existing?.gender ?? null,
  date_of_birth: existing?.date_of_birth ?? null,
  role: normalizeRoleForSupabase(user.role),
  department: existing?.department ?? null,
  joined_at: existing?.joined_at ?? user.joinDate,
  is_active: existing?.is_active ?? true,
  timezone: getDeviceTimezone(),
});

const upsertUser = async (row: SupabaseUserRow): Promise<void> => {
  const { error } = await supabase.from(USERS_TABLE).upsert(row, { onConflict: 'clerk_user_id' });

  if (error) {
    throw new Error(`[supabase] Failed to upsert user for ${row.clerk_user_id}: ${error.message}`);
  }
};

export const getUserByClerkId = async (clerkId: string): Promise<SupabaseUserRow | null> => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('*')
    .eq('clerk_user_id', clerkId)
    .maybeSingle<SupabaseUserRow>();

  if (error) {
    // Some RLS setups allow insert/upsert but not select; do not block sync.
    console.warn(`[supabase] Unable to read user ${clerkId} before upsert: ${error.message}`);
    return null;
  }

  return data;
};

export const getSupabaseUserIdByClerkId = async (clerkId: string): Promise<string> => {
  const user = await getUserByClerkId(clerkId);

  if (!user?.id) {
    throw new Error('[supabase] Unable to resolve Supabase user id for reading progress.');
  }

  return user.id;
};

export const syncProfileFromClerkUser = async (clerkUser: ClerkUserResource): Promise<void> => {
  const existing = await getUserByClerkId(clerkUser.id);
  await upsertUser(baseRowFromClerk(clerkUser, existing));
};

export const syncProfileFromStoreUser = async (user: User): Promise<void> => {
  const existing = await getUserByClerkId(user.id);
  await upsertUser(baseRowFromStoreUser(user, existing));
};
