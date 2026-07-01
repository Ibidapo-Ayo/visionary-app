import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import Card from '@components/Card';
import Button from '@components/Button';
import ScreenBackground from '@components/ScreenBackground';
import { colors } from '../../lib/theme';

const ProfileScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} className="gap-[18px] px-7 pt-9">
        <Animated.View entering={FadeIn}>
          <Card variant="elevated" blurVariant="strong" padding="lg">
            <View className="flex-row items-center gap-[18px]">
              <View className="h-[62px] w-[62px] items-center justify-center rounded-full border border-[rgba(10,147,54,0.28)] bg-[rgba(10,147,54,0.14)]">
                <Text className="text-[20px] font-bold text-[#A84413]">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-[26px] font-extrabold text-black">{user?.firstName} {user?.lastName}</Text>
                <Text className="text-[14px] text-[#718078]">{user?.email}</Text>
                <Text className="mt-1 text-[11px] font-bold text-[#D85A16]">{user?.role}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(60)}>
          <Card padding="lg" blurVariant="soft">
            <Text className="mb-[14px] text-[16px] font-bold text-black">Growth Milestones</Text>
            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <Text className="text-[26px] font-bold text-[#D85A16]">45</Text>
                <Text className="text-[11px] text-[#718078]">Events</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[26px] font-bold text-[#D85A16]">92%</Text>
                <Text className="text-[11px] text-[#718078]">Attendance</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[26px] font-bold text-[#D85A16]">12</Text>
                <Text className="text-[11px] text-[#718078]">Prayers</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(120)}>
          <Card padding="lg" blurVariant="soft">
            <Text className="mb-[14px] text-[16px] font-bold text-black">Preferences</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Feather name="bell" size={18} color={colors.textSecondary} />
                <Text className="text-[14px] font-semibold text-[#2D3A33]">Push notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D2DDD5', true: 'rgba(10,147,54,0.48)' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={SlideInUp.delay(180)}>
          <Button title="Sign Out" onPress={handleLogout} variant="danger" fullWidth />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
};

export default ProfileScreen;
