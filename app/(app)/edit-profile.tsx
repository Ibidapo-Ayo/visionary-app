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
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@store/authStore';
import Button from '@components/Button';

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? '';
  const lastInitial = lastName?.trim()?.charAt(0) ?? '';

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? 'V').toUpperCase();
};

const EditProfileScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = React.useState(user?.firstName ?? '');
  const [lastName, setLastName] = React.useState(user?.lastName ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [phone, setPhone] = React.useState(user?.phone ?? '');
  const [bio, setBio] = React.useState(user?.bio ?? '');
  const [profileImage, setProfileImage] = React.useState(user?.profileImage ?? '');
  const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);

  const previewInitials = getInitials(firstName, lastName, email);
  const trimmedImage = profileImage.trim();
  const shouldShowPreviewImage = !!trimmedImage && !avatarLoadFailed;

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to set your profile picture.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setAvatarLoadFailed(false);
    setProfileImage(result.assets[0].uri);
  };

  const handleSave = () => {
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

    setUser({
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim() || undefined,
      profileImage: trimmedImage || undefined,
      updatedAt: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <LinearGradient colors={['#030303', '#090909', '#111111']} className="flex-1">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }} className="px-5 pt-8" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(250)} className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full border border-[#2D2D2D] bg-[#151515]"
              onPress={() => router.back()}
            >
              <Feather name="chevron-left" size={18} color="#F0F0F0" />
            </TouchableOpacity>

            <Text className="text-[18px] font-bold text-white">Edit Profile</Text>

            <View className="h-10 w-10" />
          </Animated.View>

          <Animated.View entering={SlideInUp.duration(280)} className="mb-4 items-center rounded-[22px] border border-[#2A2A2A] bg-[#121212] px-4 py-6">
            <TouchableOpacity
              onPress={pickImageFromGallery}
              activeOpacity={0.9}
              className="items-center"
            >
              <View className="h-[96px] w-[96px] overflow-hidden rounded-full border border-[#3B2A1B] bg-[#1B150E]">
                {shouldShowPreviewImage ? (
                  <Image
                    source={{ uri: trimmedImage }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    onError={() => setAvatarLoadFailed(true)}
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="text-[28px] font-extrabold text-[#FF9A3D]">{previewInitials}</Text>
                  </View>
                )}
              </View>

              <View className="-mt-7 ml-[58px] h-8 w-8 items-center justify-center rounded-full border border-[#3A2A1B] bg-[#1A130D]">
                <Feather name="image" size={14} color="#FF9A3D" />
              </View>
            </TouchableOpacity>
            <Text className="mt-3 text-[12px] text-[#9A9A9A]">Tap avatar to choose from gallery</Text>
          </Animated.View>

          <Animated.View entering={SlideInUp.delay(70).duration(280)} className="gap-3">
            <View className="rounded-[18px] border border-[#2A2A2A] bg-[#121212] px-4 py-3.5">
              <Text className="mb-2 text-[12px] font-semibold text-[#A9A9A9]">First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor="#6E6E6E"
                className="text-[14px] text-white"
              />
            </View>

            <View className="rounded-[18px] border border-[#2A2A2A] bg-[#121212] px-4 py-3.5">
              <Text className="mb-2 text-[12px] font-semibold text-[#A9A9A9]">Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor="#6E6E6E"
                className="text-[14px] text-white"
              />
            </View>

            <View className="rounded-[18px] border border-[#2A2A2A] bg-[#121212] px-4 py-3.5">
              <Text className="mb-2 text-[12px] font-semibold text-[#A9A9A9]">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@example.com"
                placeholderTextColor="#6E6E6E"
                className="text-[14px] text-white"
              />
            </View>

            <View className="rounded-[18px] border border-[#2A2A2A] bg-[#121212] px-4 py-3.5">
              <Text className="mb-2 text-[12px] font-semibold text-[#A9A9A9]">Phone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+123456789"
                placeholderTextColor="#6E6E6E"
                className="text-[14px] text-white"
              />
            </View>

            <View className="rounded-[18px] border border-[#2A2A2A] bg-[#121212] px-4 py-3.5">
              <Text className="mb-2 text-[12px] font-semibold text-[#A9A9A9]">Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Share a short bio"
                placeholderTextColor="#6E6E6E"
                multiline
                textAlignVertical="top"
                style={{ minHeight: 88 }}
                className="text-[14px] text-white"
              />
            </View>
          </Animated.View>

          <Animated.View entering={SlideInUp.delay(140).duration(300)} className="mt-5 gap-3">
            <Button title="Save Changes" onPress={handleSave} fullWidth />
            <Button title="Cancel" onPress={() => router.back()} variant="tertiary" fullWidth />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default EditProfileScreen;