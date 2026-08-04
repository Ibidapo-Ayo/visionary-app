import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import Card from '@components/Card';

export interface ProfileSettingsItem {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  rightControl?: React.ReactNode;
  destructive?: boolean;
}

interface ProfileSettingsListProps {
  title: string;
  isDark: boolean;
  items: ProfileSettingsItem[];
  delay?: number;
}

const ProfileSettingsList = ({ title, isDark, items, delay = 220 }: ProfileSettingsListProps) => {
  return (
    <Animated.View entering={FadeIn.delay(delay).duration(320)} className="mt-2">
      <Text className="mb-3 text-[18px] font-bold" style={{ color: isDark ? '#F6F6F6' : '#1D1914' }}>
        {title}
      </Text>

      <Card
        animated={false}
        padding="none"
        blurVariant="none"
        style={{
          borderColor: isDark ? '#2D2D2D' : '#E9DFD4',
          backgroundColor: isDark ? 'rgba(16,16,16,0.84)' : 'rgba(255,255,255,0.86)',
        }}
      >
        {items.map((item, index) => {
          const labelColor = item.destructive ? '#D94E00' : isDark ? '#ECE6DF' : '#2B2219';
          const subtleColor = isDark ? '#A5A09A' : '#7A7670';

          return (
            <Animated.View key={item.id} entering={SlideInUp.delay(delay + index * 30).duration(300)}>
              <TouchableOpacity
                disabled={!item.onPress}
                activeOpacity={item.onPress ? 0.88 : 1}
                onPress={item.onPress}
                className="flex-row items-center gap-3 px-4 py-3.5"
                style={{
                  borderBottomWidth: index === items.length - 1 ? 0 : 1,
                  borderBottomColor: isDark ? '#262626' : '#EFE6DB',
                }}
              >
                <View
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: item.destructive
                      ? isDark
                        ? 'rgba(217,78,0,0.2)'
                        : 'rgba(217,78,0,0.14)'
                      : isDark
                        ? 'rgba(255,122,0,0.14)'
                        : 'rgba(255,122,0,0.16)',
                  }}
                >
                  <Feather name={item.icon} size={15} color={item.destructive ? '#D94E00' : '#FF7A00'} />
                </View>

                <View className="flex-1">
                  <Text className="text-[13px] font-semibold" style={{ color: labelColor }}>
                    {item.label}
                  </Text>
                  {item.value ? (
                    <Text className="mt-0.5 text-[11px]" style={{ color: subtleColor }}>
                      {item.value}
                    </Text>
                  ) : null}
                </View>

                {item.rightControl ? (
                  item.rightControl
                ) : item.onPress ? (
                  <Feather name="chevron-right" size={16} color={subtleColor} />
                ) : null}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Card>
    </Animated.View>
  );
};

export const AppearanceControl = ({
  isDark,
  value,
  onChange,
}: {
  isDark: boolean;
  value: 'light' | 'dark' | 'system';
  onChange: (value: 'light' | 'dark' | 'system') => void;
}) => {
  const options: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];

  return (
    <View className="flex-row items-center gap-1">
      {options.map((option) => {
        const selected = option === value;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            className="rounded-full border px-2.5 py-1"
            style={{
              borderColor: selected ? '#FF7A00' : isDark ? '#3A3A3A' : '#E5D9CC',
              backgroundColor: selected
                ? isDark
                  ? 'rgba(255,122,0,0.2)'
                  : 'rgba(255,122,0,0.16)'
                : isDark
                  ? 'rgba(23,23,23,0.9)'
                  : 'rgba(255,255,255,0.92)',
            }}
          >
            <Text
              className="text-[10px] font-bold uppercase"
              style={{ color: selected ? '#FF7A00' : isDark ? '#B7B7B7' : '#7A756F' }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const NotificationsControl = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Switch
      value={enabled}
      onValueChange={onChange}
      trackColor={{ false: '#4A4A4A', true: 'rgba(255,122,0,0.45)' }}
      thumbColor="#FFFFFF"
    />
  );
};

export default ProfileSettingsList;
