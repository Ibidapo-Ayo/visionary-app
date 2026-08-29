import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignOut } from '@services/auth';
import { openNotificationSettings } from '@/services/notifications/bibleReadingReminders';
import { useNotificationReminderStore } from '@/store/notificationReminderStore';

type ReminderPeriod = 'morning' | 'evening';

const MORNING_TIMER_OPTIONS = [5, 6, 7, 8, 9, 10, 12];
const EVENING_TIMER_OPTIONS = [17, 18, 19, 20, 21, 22];

const formatHourLabel = (hour: number) => {
  const normalizedHour = hour % 24;
  const twelveHourValue = ((normalizedHour + 11) % 12) + 1;
  const suffix = normalizedHour >= 12 ? 'PM' : 'AM';
  return `${twelveHourValue}:00 ${suffix}`;
};

const statusTextMap: Record<'granted' | 'denied' | 'undetermined', string> = {
  granted: 'Enabled',
  denied: 'Blocked',
  undetermined: 'Not requested',
};

const actionLabelMap: Record<'granted' | 'denied' | 'undetermined', string> = {
  granted: 'Manage access',
  denied: 'Open settings',
  undetermined: 'Enable now',
};

const SettingsAction = ({
  icon,
  title,
  subtitle,
  tint,
  onPress,
  actionLabel,
  disabled,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle: string;
  tint: string;
  onPress: () => void;
  actionLabel: string;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    activeOpacity={0.88}
    className={`rounded-[18px] border border-[#EFE7DD] bg-white px-4 py-4 ${disabled ? 'opacity-70' : ''}`}
  >
    <View className="flex-row items-start">
      <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${tint}1A` }}>
        <Feather name={icon} size={18} color={tint} />
      </View>
      <View className="ml-3 flex-1 pr-2">
        <Text className="text-[13px] font-black text-[#1E1A16]">{title}</Text>
        <Text className="mt-1 text-[11px] font-semibold leading-[16px] text-[#7F756B]">{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="#A59A8D" />
    </View>

    <View className="mt-3 self-start rounded-full bg-[#FFF1E5] px-3 py-1">
      <Text className="text-[10px] font-black uppercase text-[#B95B00]">{actionLabel}</Text>
    </View>
  </TouchableOpacity>
);

const ReminderTimerSelector = ({
  label,
  selectedHours,
  options,
  onToggle,
}: {
  label: string;
  selectedHours: number[];
  options: number[];
  onToggle: (hour: number) => void;
}) => (
  <View>
    <View className="flex-row items-center justify-between">
      <Text className="text-[12px] font-black text-[#1E1A16]">{label}</Text>
      <View className="rounded-full bg-[#FFF1E5] px-2.5 py-1">
        <Text className="text-[9px] font-black uppercase text-[#B95B00]">
          {selectedHours.length > 0 ? `${selectedHours.length} selected` : 'Using default'}
        </Text>
      </View>
    </View>

    <View className="mt-2 flex-row flex-wrap gap-2">
      {options.map((hour) => {
        const isSelected = selectedHours.includes(hour);

        return (
          <TouchableOpacity
            key={`${label}-${hour}`}
            activeOpacity={0.84}
            onPress={() => onToggle(hour)}
            className="rounded-full border px-3 py-1.5"
            style={{
              borderColor: isSelected ? '#FF7A00' : '#E8DECF',
              backgroundColor: isSelected ? '#FFF1E5' : '#FFFCF8',
            }}
          >
            <Text
              className="text-[10px] font-black"
              style={{ color: isSelected ? '#B95B00' : '#7A7066' }}
            >
              {formatHourLabel(hour)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const SettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signOut = useSignOut();

  const permissionStatus = useNotificationReminderStore((state) => state.permissionStatus);
  const canAskAgain = useNotificationReminderStore((state) => state.canAskAgain);
  const hydrateReminderStore = useNotificationReminderStore((state) => state.hydrate);
  const requestReminderPermission = useNotificationReminderStore((state) => state.requestPermission);
  const syncReminderPermissionStatus = useNotificationReminderStore((state) => state.syncPermissionStatus);
  const morningReminderHours = useNotificationReminderStore((state) => state.morningReminderHours);
  const eveningReminderHours = useNotificationReminderStore((state) => state.eveningReminderHours);
  const setReminderHours = useNotificationReminderStore((state) => state.setReminderHours);
  const resetReminderHours = useNotificationReminderStore((state) => state.resetReminderHours);

  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [isUpdatingPermission, setIsUpdatingPermission] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ message: string; tone: 'success' | 'warning' | 'error' } | null>(null);

  React.useEffect(() => {
    void hydrateReminderStore()
      .then(() => syncReminderPermissionStatus())
      .catch(() => {
        setFeedback({
          message: 'Unable to load notification settings. Please try again.',
          tone: 'error',
        });
      });
  }, [hydrateReminderStore, syncReminderPermissionStatus]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(app)/profile');
  };

  const handleNotificationAction = async () => {
    setIsUpdatingPermission(true);
    setFeedback(null);

    try {
      if (permissionStatus === 'granted') {
        await openNotificationSettings();
        setFeedback({
          message: 'Device settings opened. You can fine-tune notification behavior there.',
          tone: 'success',
        });
        return;
      }

      if (canAskAgain) {
        const nextStatus = await requestReminderPermission();

        if (nextStatus === 'granted') {
          setFeedback({
            message: 'Notifications enabled. Daily reminders will stay in sync with your reading progress.',
            tone: 'success',
          });
          return;
        }
      }

      await openNotificationSettings();
      setFeedback({
        message: 'Notifications are blocked at OS level. Update permission in device settings to enable reminders.',
        tone: 'warning',
      });
    } catch {
      setFeedback({
        message: 'Could not update notification permissions right now.',
        tone: 'error',
      });
    } finally {
      setIsUpdatingPermission(false);
      await syncReminderPermissionStatus().catch(() => null);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setFeedback(null);

    const result = await signOut();
    setIsSigningOut(false);

    if (!result.success) {
      setFeedback({
        message: result.error?.message ?? 'Sign out failed. Please try again.',
        tone: 'error',
      });
      return;
    }

    router.replace('/(auth)/login');
  };

  const toggleReminderHour = async (period: ReminderPeriod, hour: number) => {
    const activeHours = period === 'morning' ? morningReminderHours : eveningReminderHours;
    const nextHours = activeHours.includes(hour)
      ? activeHours.filter((value) => value !== hour)
      : [...activeHours, hour].sort((a, b) => a - b);

    await setReminderHours(period, nextHours);

    setFeedback({
      message: 'Reminder timers saved. Selected times are now active.',
      tone: 'success',
    });
  };

  const handleResetReminderTimers = async () => {
    await resetReminderHours();
    setFeedback({
      message: 'Reminder timers reset. Default schedule is active again.',
      tone: 'success',
    });
  };

  const notificationStatusText = statusTextMap[permissionStatus];
  const isReminderPermissionEnabled = permissionStatus === 'granted';

  return (
    <View className="flex-1 bg-[#F7F1E8]">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 36, 48) }}>
        <LinearGradient colors={['#111111', '#191919', '#202020']} className="rounded-b-[30px] px-5 pb-7" style={{ paddingTop: insets.top + 12 }}>
          <View className="absolute inset-0 opacity-20">
            <View className="absolute left-[-30px] top-8 h-52 w-52 rounded-full border border-[#333333]" />
            <View className="absolute right-[-60px] top-16 h-64 w-64 rounded-full border border-[#3A3A3A]" />
          </View>

          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleBack} activeOpacity={0.82} className="h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <Feather name="arrow-left" size={19} color="#F5EFE9" />
            </TouchableOpacity>

            <View className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <Text className="text-[10px] font-black uppercase text-[#F3E9DE]">Visionary Hub</Text>
            </View>
          </View>

          <Animated.View entering={FadeIn.delay(80).duration(320)} className="mt-6">
            <Text className="text-[30px] font-black text-white">Settings</Text>
            <Text className="mt-2 max-w-[290px] text-[12px] font-semibold leading-[18px] text-[#CEC5BC]">
              Personalize your account, notification access, and app experience from one place.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View className="-mt-4 px-5">
          {feedback ? (
            <Animated.View entering={FadeInDown.duration(280)} className="mb-4 rounded-[16px] border px-4 py-3" style={{
              borderColor: feedback.tone === 'error' ? '#F1C3B9' : feedback.tone === 'warning' ? '#F3D7B4' : '#BFE3C9',
              backgroundColor: feedback.tone === 'error' ? '#FDECEA' : feedback.tone === 'warning' ? '#FFF3E3' : '#EAF8EE',
            }}>
              <Text className="text-[11px] font-black" style={{
                color: feedback.tone === 'error' ? '#A93A24' : feedback.tone === 'warning' ? '#A95A00' : '#1E7A3A',
              }}>
                {feedback.message}
              </Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(60).duration(320)} className="rounded-[22px] border border-[#ECE2D7] bg-[#FFFDFC] p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[13px] font-black text-[#1D1914]">Account</Text>
              <View className="rounded-full bg-[#FFF1E5] px-2.5 py-1">
                <Text className="text-[9px] font-black uppercase text-[#B95B00]">Core actions</Text>
              </View>
            </View>

            <View className="gap-2">
              <SettingsAction
                icon="user"
                title="Edit profile"
                subtitle="Update your name, photo, and personal information."
                tint="#FF7A00"
                actionLabel="Open profile editor"
                onPress={() => router.push('/(app)/edit-profile')}
              />

              <SettingsAction
                icon="bell"
                title="Notification permission"
                subtitle={`Current status: ${notificationStatusText}. Enable reminders for morning and evening readings.`}
                tint="#16A34A"
                actionLabel={isUpdatingPermission ? 'Updating...' : actionLabelMap[permissionStatus]}
                onPress={() => {
                  void handleNotificationAction();
                }}
                disabled={isUpdatingPermission}
              />

              <View className="rounded-[18px] border border-[#EFE7DD] bg-white px-4 py-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[13px] font-black text-[#1E1A16]">Reminder timers</Text>
                    <Text className="mt-1 text-[11px] font-semibold leading-[16px] text-[#7F756B]">
                      Enable reminder permission first, then choose the morning and evening times you prefer.
                    </Text>
                  </View>
                  <View className={`rounded-full px-2.5 py-1 ${isReminderPermissionEnabled ? 'bg-[#EAF8EE]' : 'bg-[#F4EEE7]'}`}>
                    <Text className={`text-[9px] font-black uppercase ${isReminderPermissionEnabled ? 'text-[#1E7A3A]' : 'text-[#8D7E6F]'}`}>
                      {isReminderPermissionEnabled ? 'Ready' : 'Step 1'}
                    </Text>
                  </View>
                </View>

                {isReminderPermissionEnabled ? (
                  <View className="mt-4 gap-4">
                    <ReminderTimerSelector
                      label="Morning reminders"
                      selectedHours={morningReminderHours}
                      options={MORNING_TIMER_OPTIONS}
                      onToggle={(hour) => {
                        void toggleReminderHour('morning', hour);
                      }}
                    />

                    <ReminderTimerSelector
                      label="Evening reminders"
                      selectedHours={eveningReminderHours}
                      options={EVENING_TIMER_OPTIONS}
                      onToggle={(hour) => {
                        void toggleReminderHour('evening', hour);
                      }}
                    />

                    <TouchableOpacity
                      activeOpacity={0.84}
                      onPress={() => {
                        void handleResetReminderTimers();
                      }}
                      className="self-start rounded-full border border-[#EDD8C5] bg-[#FFF7EF] px-3 py-1.5"
                    >
                      <Text className="text-[10px] font-black uppercase text-[#A85D13]">Reset to default schedule</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.84}
                    onPress={() => {
                      void handleNotificationAction();
                    }}
                    className="mt-3 self-start rounded-full bg-[#FF7A00] px-3.5 py-2"
                  >
                    <Text className="text-[10px] font-black uppercase text-white">
                      {isUpdatingPermission ? 'Updating...' : actionLabelMap[permissionStatus]}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <SettingsAction
                icon="smartphone"
                title="Open device settings"
                subtitle="Control system-level permissions and app behavior on your device."
                tint="#111111"
                actionLabel="Open now"
                onPress={() => {
                  void openNotificationSettings();
                }}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(320)} className="mt-4 rounded-[22px] border border-[#F1D4C4] bg-[#FFF6F1] p-4">
            <Text className="text-[13px] font-black text-[#41220F]">Session</Text>
            <Text className="mt-2 text-[11px] font-semibold leading-[17px] text-[#7E5A45]">
              Sign out when you are done using this device to keep your account secure.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              disabled={isSigningOut}
              onPress={() => {
                void handleSignOut();
              }}
              className={`mt-4 overflow-hidden rounded-[14px] ${isSigningOut ? 'opacity-70' : ''}`}
            >
              <LinearGradient colors={['#FF8A26', '#FF7A00']} className="flex-row items-center justify-center px-4 py-3">
                <Feather name="log-out" size={16} color="#FFFFFF" />
                <Text className="ml-2 text-[12px] font-black text-white">{isSigningOut ? 'Signing out...' : 'Sign out of Visionary Hub'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
