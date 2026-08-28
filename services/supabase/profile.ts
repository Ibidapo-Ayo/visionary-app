import type { ClerkAuthUserResource, SupabaseUserRow, User } from '@/types/index';
import { decode } from 'base64-arraybuffer';
import { supabase } from './client';
import { USERS_TABLE } from './constants';

const PROFILE_IMAGES_BUCKET = 'visionary-app-bucket';
const PROFILE_IMAGES_FOLDER = 'profile_images';

const getPrimaryEmail = (user: ClerkAuthUserResource): string =>
  user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? '';

const getPrimaryPhone = (user: ClerkAuthUserResource): string =>
  user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers?.[0]?.phoneNumber ?? '';

const getMetadataPhone = (user: ClerkAuthUserResource): string => {
  const metadataValue = user.unsafeMetadata?.phone_number;
  return typeof metadataValue === 'string' ? metadataValue : '';
};

const toNullable = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const nowIso = (): string => new Date().toISOString();

const getTimezoneValueForSupabase = (existing?: SupabaseUserRow | null): string => {
  // `users.timezone` is configured as timestamptz in this project DB, so persist
  // an ISO value instead of an IANA timezone id (e.g. "Africa/Lagos").
  return existing?.timezone?.trim() || nowIso();
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

const baseRowFromClerk = (user: ClerkAuthUserResource, existing?: SupabaseUserRow | null): SupabaseUserRow => {
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
    // Keep an existing saved profile image (including app uploads) instead of
    // overwriting it on every Clerk sync.
    profile_image: existing?.profile_image ?? toNullable(user.imageUrl) ?? null,
    bio: existing?.bio ?? null,
    gender: existing?.gender ?? null,
    date_of_birth: existing?.date_of_birth ?? null,
    role: normalizeRoleForSupabase(existing?.role ?? 'MEMBER'),
    department: existing?.department ?? null,
    joined_at: existing?.joined_at ?? createdAt,
    is_active: existing?.is_active ?? true,
    timezone: getTimezoneValueForSupabase(existing),
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
  phone_number: toNullable(user.phone) ?? existing?.phone_number ?? null,
  profile_image: toNullable(user.profileImage) ?? existing?.profile_image ?? null,
  bio: toNullable(user.bio) ?? existing?.bio ?? null,
  gender: toNullable(user.gender) ?? existing?.gender ?? null,
  date_of_birth: existing?.date_of_birth ?? null,
  role: normalizeRoleForSupabase(user.role),
  department: existing?.department ?? null,
  joined_at: existing?.joined_at ?? user.joinDate,
  is_active: existing?.is_active ?? true,
  timezone: getTimezoneValueForSupabase(existing),
});

const upsertUser = async (row: SupabaseUserRow): Promise<SupabaseUserRow> => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .upsert(row, { onConflict: 'clerk_user_id' })
    .select('*')
    .single<SupabaseUserRow>();

  if (error) {
    throw new Error(`[supabase] Failed to upsert user for ${row.clerk_user_id}: ${error.message}`);
  }

  return data;
};

const insertUser = async (row: SupabaseUserRow): Promise<SupabaseUserRow> => {
  const { data, error } = await supabase.from(USERS_TABLE).insert(row).select('*').single<SupabaseUserRow>();

  if (error) {
    throw new Error(`[supabase] Failed to insert user for ${row.clerk_user_id}: ${error.message}`);
  }

  return data;
};

const getImageExtensionFromUri = (uri: string): string => {
  const cleanUri = uri.split('?')[0] ?? uri;
  const extension = cleanUri.split('.').pop()?.toLowerCase();

  if (!extension) {
    return 'jpg';
  }

  if (extension === 'jpeg') {
    return 'jpg';
  }

  return extension;
};

const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

const getImageMimeType = (extension: string): string => {
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'heic':
      return 'image/heic';
    case 'jpg':
      return 'image/jpeg';
    default:
      throw new Error(`[supabase] Unsupported profile image type: .${extension}`);
  }
};

export type UploadedProfileImage = {
  publicUrl: string;
  objectPath: string;
};

export const uploadProfileImageAsset = async (
  userId: string,
  localAssetUri: string,
  imageBase64?: string,
  pickerMimeType?: string,
): Promise<UploadedProfileImage> => {
  const extension = getImageExtensionFromUri(localAssetUri);
  const normalizedPickerMimeType = pickerMimeType?.trim().toLowerCase();
  const contentType = ACCEPTED_IMAGE_MIME_TYPES.has(normalizedPickerMimeType ?? '')
    ? (normalizedPickerMimeType as string)
    : getImageMimeType(extension);
  const objectPath = `${PROFILE_IMAGES_FOLDER}/${userId}/${Date.now()}.${extension}`;

  if (!imageBase64?.trim()) {
    throw new Error('[supabase] Unable to read selected profile image for upload.');
  }

  const imageBuffer = decode(imageBase64);
  const { error: uploadError } = await supabase.storage.from(PROFILE_IMAGES_BUCKET).upload(objectPath, imageBuffer, {
    contentType,
    upsert: true,
  });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes('row-level security policy')) {
      throw new Error(
        '[supabase] Failed to upload profile image: blocked by storage policy. Allow uploads to visionary-app-bucket/profile_images for this user.',
      );
    }

    throw new Error(`[supabase] Failed to upload profile image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(objectPath);
  if (!publicUrlData?.publicUrl) {
    throw new Error('[supabase] Profile image upload succeeded but no public URL was returned.');
  }

  console.log("Public URL for uploaded profile image:", publicUrlData.publicUrl);

  return { publicUrl: publicUrlData.publicUrl, objectPath };
};

// Best-effort cleanup for uploads that never become the persisted profile image.
export const deleteProfileImageAsset = async (objectPath: string): Promise<void> => {
  const { error } = await supabase.storage.from(PROFILE_IMAGES_BUCKET).remove([objectPath]);

  if (error) {
    console.warn(`[supabase] Failed to delete orphaned profile image ${objectPath}: ${error.message}`);
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


export const syncProfileFromClerkUser = async (clerkUser: ClerkAuthUserResource): Promise<SupabaseUserRow> => {
  const existing = await getUserByClerkId(clerkUser.id);

  // Important: once a user exists in Supabase, profile updates should come from
  // in-app edits (syncProfileFromStoreUser), not from Clerk fields on sign-in.
  if (existing) {
    return existing;
  }

  try {
    return await insertUser(baseRowFromClerk(clerkUser, null));
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('duplicate key value violates unique constraint')) {
      const rowAfterConflict = await getUserByClerkId(clerkUser.id);
      if (rowAfterConflict) {
        return rowAfterConflict;
      }
    }

    throw error;
  }
};

export const syncProfileFromStoreUser = async (user: User): Promise<SupabaseUserRow> => {
  const existing = await getUserByClerkId(user.id);
  console.log("Existing store user", existing);
  return upsertUser(baseRowFromStoreUser(user, existing));
};
