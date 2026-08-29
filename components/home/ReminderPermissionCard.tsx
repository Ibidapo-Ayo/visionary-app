import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReminderPermissionCardProps {
  visible: boolean;
  isExistingUser: boolean;
  doNotShowAgain: boolean;
  canAskAgain: boolean;
  onToggleDoNotShowAgain: (nextValue: boolean) => void;
  onEnablePress: () => void;
  onDismissPress: () => void;
}

const ReminderPermissionCard = ({
  visible,
  isExistingUser,
  doNotShowAgain,
  canAskAgain,
  onToggleDoNotShowAgain,
  onEnablePress,
  onDismissPress,
}: ReminderPermissionCardProps) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18).stiffness(160)}
      exiting={SlideOutDown.duration(220)}
      className="absolute left-4 right-4"
      style={{ bottom: Math.max(insets.bottom + 84, 98) }}
    >
      <LinearGradient
        colors={['#1D1813', '#17120E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[24px] border border-[#3D2A1A]"
      >
        <View className="p-4">
          <View className="flex-row items-start">
            <View className="mr-3 mt-0.5 h-10 w-10 items-center justify-center rounded-full bg-[#FF7A00]">
              <Feather name="clock" size={18} color="#FFFFFF" />
            </View>

            <View className="flex-1">
              <Text className="text-[15px] font-black text-[#FFF5EA]">Daily Bible reminders</Text>
              <Text className="mt-1 text-[12px] font-semibold leading-[19px] text-[#EADAC8]">
                Stay on track with gentle reminders at key times. We only notify you when your reading period is still incomplete.
              </Text>
            </View>
          </View>

          {isExistingUser ? (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => onToggleDoNotShowAgain(!doNotShowAgain)}
              className="mt-3 flex-row items-center"
            >
              <View
                className={`h-5 w-5 items-center justify-center rounded-[6px] border ${
                  doNotShowAgain ? 'border-[#FF7A00] bg-[#FF7A00]' : 'border-[#8A7664] bg-transparent'
                }`}
              >
                {doNotShowAgain ? <Feather name="check" size={12} color="#FFFFFF" /> : null}
              </View>
              <Text className="ml-2 text-[11px] font-semibold text-[#DCCAB8]">Do not show this reminder card again</Text>
            </TouchableOpacity>
          ) : null}

          <View className="mt-4 flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onEnablePress}
              className="flex-1 items-center rounded-full bg-[#FF7A00] py-3"
            >
              <Text className="text-[12px] font-black text-white">{canAskAgain ? 'Allow notifications' : 'Open settings'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              onPress={onDismissPress}
              className="items-center rounded-full border border-[#5C4A3A] px-4 py-3"
            >
              <Text className="text-[12px] font-bold text-[#E2D3C3]">Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default ReminderPermissionCard;
