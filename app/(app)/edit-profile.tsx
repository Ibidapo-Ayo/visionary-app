import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@store/authStore';
import { deleteProfileImageAsset, syncProfileFromStoreUser, uploadProfileImageAsset } from '@services/supabase';
import BrandedSpinner from '@/components/BrandedSpinner';

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? '';
  const lastInitial = lastName?.trim()?.charAt(0) ?? '';

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? 'V').toUpperCase();
};

type FieldProps = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  children: React.ReactNode;
  helper?: string;
};

const Field = ({ label, icon, children, helper }: FieldProps) => (
  <View className="rounded-[18px] border border-[#EFE5D8] bg-white px-4 py-3.5">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FFF2E6]">
          <Feather name={icon} size={14} color="#FF7A00" />
        </View>
        <Text className="ml-2 text-[11px] font-black uppercase tracking-[0.6px] text-[#81776D]">{label}</Text>
      </View>
      {helper ? <Text className="text-[10px] font-bold text-[#B1A79B]">{helper}</Text> : null}
    </View>
    <View className="mt-3">{children}</View>
  </View>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <View className="mb-3">
    <Text className="text-[15px] font-black text-[#171717]">{title}</Text>
    <Text className="mt-0.5 text-[11px] font-semibold text-[#81776D]">{subtitle}</Text>
  </View>
);

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

const EditProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = React.useState(user?.firstName ?? '');
  const [lastName, setLastName] = React.useState(user?.lastName ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState(user?.phone ?? '');
  const [bio, setBio] = React.useState(user?.bio ?? '');
  const [gender, setGender] = React.useState((user?.gender ?? '').trim().toLowerCase());
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(user?.profileImage ?? '');
  const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  // Object path of an uploaded photo not yet confirmed by a successful save.
  const pendingUploadObjectPathRef = React.useRef<string | null>(null);

  const previewInitials = getInitials(firstName, lastName, email);
  const trimmedImage = profileImage.trim();
  const selectedGenderLabel =
    GENDER_OPTIONS.find((option) => option.value === gender)?.label ?? 'Select gender';
  const shouldShowPreviewImage = !!trimmedImage && !avatarLoadFailed;
  const previewName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Visionary Member';
  const isReadyToSave = Boolean(firstName.trim() && lastName.trim() && email.trim()) && !isSaving && !isUploadingPhoto;

  const pickImageFromGallery = async () => {
    if (isUploadingPhoto || isSaving) {
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to set your profile picture.');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      if (!user?.id) {
        Alert.alert('Error', 'No user profile found.');
        return;
      }

      const { publicUrl, objectPath } = await uploadProfileImageAsset(
        user.id,
        result.assets[0].uri,
        result.assets[0].base64 ?? undefined,
        result.assets[0].mimeType,
      );

      // Replacing a still-unsaved upload: remove the previous orphan before tracking the new one.
      const previousPendingObjectPath = pendingUploadObjectPathRef.current;
      pendingUploadObjectPathRef.current = objectPath;

      setAvatarLoadFailed(false);
      setProfileImage(publicUrl);

      if (previousPendingObjectPath) {
        void deleteProfileImageAsset(previousPendingObjectPath);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to upload photo.';
      console.log('Profile image upload failed:', error);
      Alert.alert('Upload failed', message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No user profile found.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Missing details', 'First name and last name are required.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Missing details', 'Email is required.');
      return;
    }

    const updatedUser = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim() || undefined,
      gender: gender || undefined,
      profileImage: trimmedImage || undefined,
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      await syncProfileFromStoreUser(updatedUser);
      setUser(updatedUser);
      // Save succeeded, so the pending upload is now the persisted profile image.
      pendingUploadObjectPathRef.current = null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sync profile.';
      Alert.alert('Sync failed', message);

      const pendingObjectPath = pendingUploadObjectPathRef.current;
      if (pendingObjectPath) {
        pendingUploadObjectPathRef.current = null;
        void deleteProfileImageAsset(pendingObjectPath);
        setAvatarLoadFailed(false);
        setProfileImage(user.profileImage ?? '');
      }

      return;
    } finally {
      setIsSaving(false);
    }

    router.replace('/(app)/profile?profileUpdated=1');
  };

  const handleCancel = () => {
    if (isSaving || isUploadingPhoto) {
      return;
    }

    const pendingObjectPath = pendingUploadObjectPathRef.current;
    if (pendingObjectPath) {
      pendingUploadObjectPathRef.current = null;
      void deleteProfileImageAsset(pendingObjectPath);
    }

    router.back();
  };

  return (
    <LinearGradient colors={['#FFFDF9', '#F8F3EB', '#F4EFE6']} className="flex-1">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom + 52, 72) }}
          className="px-5"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(240)} className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleCancel} activeOpacity={0.82} disabled={isSaving || isUploadingPhoto} className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
              <Feather name="chevron-left" size={20} color="#181818" />
            </TouchableOpacity>

            <View className="mx-2 flex-1 items-center">
              <Text numberOfLines={1} className="text-[16px] font-black text-[#171717]">Edit Profile</Text>
              <Text numberOfLines={1} className="mt-0.5 text-[10px] font-semibold text-[#81776D]">Identity and contact</Text>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!isReadyToSave}
              activeOpacity={0.84}
              className={`h-10 w-10 shrink-0 items-center justify-center rounded-full ${isReadyToSave ? 'bg-[#FF7A00]' : 'bg-[#E2D7CB]'}`}
            >
              {isSaving ? <BrandedSpinner size={18} tone="light" /> : <Feather name="check" size={18} color="#FFFFFF" />}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).duration(320)} className="mt-5 overflow-hidden rounded-[28px] bg-[#17191B]">
            <LinearGradient colors={['#222427', '#151719']} className="p-5">
              <View className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[#343434]" />
              <View className="absolute -left-12 bottom-0 h-32 w-32 rounded-full border border-[#2D2D2D]" />

              <View className="flex-row items-center">
                <TouchableOpacity onPress={pickImageFromGallery} activeOpacity={0.9} disabled={isUploadingPhoto || isSaving} className="relative">
                  <View className="h-[92px] w-[92px] overflow-hidden rounded-full border-[4px] border-white bg-[#242628]">
                    {shouldShowPreviewImage ? (
                      <Image
                        source={{ uri: trimmedImage }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                        onError={() => setAvatarLoadFailed(true)}
                      />
                    ) : (
                      <View className="h-full w-full items-center justify-center">
                        <Text className="text-[29px] font-black text-[#FF7A00]">{previewInitials}</Text>
                      </View>
                    )}

                    {isUploadingPhoto ? (
                      <View className="absolute inset-0 items-center justify-center bg-black/40">
                        <BrandedSpinner size={28} tone="light" />
                      </View>
                    ) : null}
                  </View>

                  <View className="absolute bottom-1 right-1 h-8 w-8 items-center justify-center rounded-full border-2 border-[#17191B] bg-[#FF7A00]">
                    <Feather name="camera" size={14} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <View className="ml-4 flex-1">
                  <Text className="text-[22px] font-black leading-7 text-white">{previewName}</Text>
                  <Text className="mt-1 text-[11px] font-semibold leading-5 text-[#CFC8BE]">
                    This profile is used across attendance, Bible Journey, and community spaces.
                  </Text>
                  <TouchableOpacity
                    onPress={pickImageFromGallery}
                    activeOpacity={0.84}
                    disabled={isUploadingPhoto || isSaving}
                    className="mt-3 self-start rounded-full bg-white/10 px-3 py-2"
                  >
                    <Text className="text-[10px] font-black text-[#FFB56D]">{isUploadingPhoto ? 'Uploading…' : 'Change photo'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(110).duration(320)} className="mt-5">
            <SectionTitle title="Personal Details" subtitle="Keep your public identity accurate." />
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="First" icon="user">
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First name"
                      placeholderTextColor="#B4AA9F"
                      className="text-[16px] font-black text-[#171717]"
                    />
                  </Field>
                </View>

                <View className="flex-1">
                  <Field label="Last" icon="user-check">
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Last name"
                      placeholderTextColor="#B4AA9F"
                      className="text-[16px] font-black text-[#171717]"
                    />
                  </Field>
                </View>
              </View>

              <Field label="Bio" icon="edit-3" helper={`${bio.length}/140`}>
                <TextInput
                  value={bio}
                  onChangeText={(value) => setBio(value.slice(0, 140))}
                  placeholder="Share a short bio"
                  placeholderTextColor="#B4AA9F"
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 92 }}
                  className="text-[15px] font-semibold leading-6 text-[#171717]"
                />
              </Field>

              <Field label="Gender" icon="users">
                <TouchableOpacity
                  onPress={() => setIsGenderDropdownOpen((prev) => !prev)}
                  activeOpacity={0.84}
                  className="h-12 flex-row items-center justify-between rounded-[14px] border border-[#EFE5D8] bg-[#FFFCF8] px-3"
                >
                  <Text className={`text-[14px] font-semibold ${gender ? 'text-[#171717]' : 'text-[#B4AA9F]'}`}>
                    {selectedGenderLabel}
                  </Text>
                  <Feather
                    name={isGenderDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#7A7167"
                  />
                </TouchableOpacity>

                {isGenderDropdownOpen ? (
                  <View className="mt-2 overflow-hidden rounded-[14px] border border-[#EFE5D8] bg-white">
                    {GENDER_OPTIONS.map((option, index) => {
                      const isSelected = option.value === gender;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => {
                            setGender(option.value);
                            setIsGenderDropdownOpen(false);
                          }}
                          activeOpacity={0.84}
                          className="flex-row items-center justify-between px-3 py-3"
                          style={{ borderBottomWidth: index === GENDER_OPTIONS.length - 1 ? 0 : 1, borderBottomColor: '#F3EBDD' }}
                        >
                          <Text className={`text-[14px] font-semibold ${isSelected ? 'text-[#FF7A00]' : 'text-[#2B2219]'}`}>
                            {option.label}
                          </Text>
                          {isSelected ? <Feather name="check" size={14} color="#FF7A00" /> : null}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </Field>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(320)} className="mt-5">
            <SectionTitle title="Contact" subtitle="Private details for account communication." />
            <View className="gap-3">
              <Field label="Email" icon="mail">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="you@example.com"
                  placeholderTextColor="#B4AA9F"
                  className="text-[15px] font-black text-[#171717]"
                />
              </Field>

              <Field label="Phone" icon="phone">
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="+123456789"
                  placeholderTextColor="#B4AA9F"
                  className="text-[15px] font-black text-[#171717]"
                />
              </Field>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(210).duration(320)} className="mt-5 rounded-[22px] border border-[#E6D9C9] bg-white p-4">
            <View className="flex-row items-start">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E6]">
                <Feather name="shield" size={17} color="#FF7A00" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-black text-[#171717]">Profile changes sync securely</Text>
                <Text className="mt-1 text-[11px] font-semibold leading-5 text-[#7D7368]">
                  Your updates are saved to your account profile and reflected across the app after syncing.
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(320)} className="mt-5 gap-3">
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isReadyToSave}
              activeOpacity={0.9}
              className={`h-14 flex-row items-center justify-center rounded-[18px] ${isReadyToSave ? 'bg-[#FF7A00]' : 'bg-[#D8C7B5]'}`}
            >
              {isSaving ? (
                <>
                  <BrandedSpinner size={18} tone="light" />
                  <Text className="ml-2 text-[14px] font-black text-white">Saving…</Text>
                </>
              ) : (
                <>
                  <Feather name="save" size={16} color="#FFFFFF" />
                  <Text className="ml-2 text-[14px] font-black text-white">Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.82}
              disabled={isSaving || isUploadingPhoto}
              className="items-center justify-center rounded-[18px] border border-[#E6D9C9] bg-white py-4"
            >
              <Text className="text-[13px] font-black text-[#5F554B]">Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default EditProfileScreen;
