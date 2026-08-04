import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Card from '@components/Card';
import type { User } from '@types/index';

interface ProfileHeaderProps {
  user: User | null;
  isDark: boolean;
  churchUnit?: string;
  memberId?: string;
  onEditProfile: () => void;
}

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? '';
  const lastInitial = lastName?.trim()?.charAt(0) ?? '';

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? 'V').toUpperCase();
};

const formatJoinDate = (isoDate?: string) => {
  if (!isoDate) {
    return 'Recently joined';
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Recently joined';
  }

  return `Joined ${date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;
};

const ProfileHeader = ({ user, isDark, churchUnit, memberId, onEditProfile }: ProfileHeaderProps) => {
  const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);

  const userInitials = getInitials(user?.firstName, user?.lastName, user?.email);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Visionary Member';
  const profileImage = user?.profileImage?.trim() ?? '';
  const shouldShowProfileImage = !!profileImage && !avatarLoadFailed;

  return (
    <Animated.View entering={FadeInDown.duration(350)}>
      <Card
        animated={false}
        padding="none"
        blurVariant="none"
        style={{
          borderColor: isDark ? '#2E2E2E' : '#E9DED2',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255,122,0,0.18)', 'rgba(28,22,15,0.95)', 'rgba(17,17,17,0.96)']
              : ['rgba(255,122,0,0.22)', 'rgba(255,247,235,0.92)', 'rgba(255,255,255,0.96)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[24px] px-5 py-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View
                className="h-[86px] w-[86px] overflow-hidden rounded-full border"
                style={{
                  borderColor: isDark ? '#4D3A29' : '#EBC8A5',
                  backgroundColor: isDark ? '#1D150F' : '#FFF1E2',
                }}
              >
                {shouldShowProfileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    onError={() => setAvatarLoadFailed(true)}
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="text-[30px] font-black" style={{ color: '#FF7A00' }}>
                      {userInitials}
                    </Text>
                  </View>
                )}
              </View>

              <View className="max-w-[67%]">
                <Text className="text-[24px] font-black" style={{ color: isDark ? '#FAFAFA' : '#1E1A15' }}>
                  {fullName}
                </Text>
                <Text className="mt-0.5 text-[13px]" style={{ color: isDark ? '#D8CEC3' : '#6D5944' }}>
                  {formatJoinDate(user?.joinDate)}
                </Text>
                <Text className="mt-1 text-[12px]" style={{ color: isDark ? '#A6A6A6' : '#7A7A7A' }}>
                  {user?.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onEditProfile}
              className="rounded-full border px-3 py-2"
              style={{
                borderColor: isDark ? '#5A4430' : '#F0B782',
                backgroundColor: isDark ? 'rgba(28,20,14,0.9)' : 'rgba(255,255,255,0.84)',
              }}
            >
              <Feather name="edit-3" size={15} color="#FF7A00" />
            </TouchableOpacity>
          </View>

          <View className="mt-5 flex-row flex-wrap gap-2">
            <View
              className="rounded-full border px-3 py-1.5"
              style={{
                borderColor: isDark ? '#2D4B35' : '#BFE5C9',
                backgroundColor: isDark ? 'rgba(12,34,18,0.8)' : 'rgba(233,251,239,0.96)',
              }}
            >
              <Text className="text-[10px] font-bold" style={{ color: isDark ? '#8FE5A8' : '#147A36' }}>
                {user?.role ?? 'MEMBER'}
              </Text>
            </View>

            {churchUnit ? (
              <View
                className="rounded-full border px-3 py-1.5"
                style={{
                  borderColor: isDark ? '#3D3932' : '#E5D7C8',
                  backgroundColor: isDark ? 'rgba(23,23,23,0.84)' : 'rgba(255,255,255,0.9)',
                }}
              >
                <Text className="text-[10px] font-semibold" style={{ color: isDark ? '#DCD2C6' : '#6D5845' }}>
                  {churchUnit}
                </Text>
              </View>
            ) : null}

            {memberId ? (
              <View
                className="rounded-full border px-3 py-1.5"
                style={{
                  borderColor: isDark ? '#3D3932' : '#E5D7C8',
                  backgroundColor: isDark ? 'rgba(23,23,23,0.84)' : 'rgba(255,255,255,0.9)',
                }}
              >
                <Text className="text-[10px] font-semibold" style={{ color: isDark ? '#DCD2C6' : '#6D5845' }}>
                  ID {memberId}
                </Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
};

export default ProfileHeader;
