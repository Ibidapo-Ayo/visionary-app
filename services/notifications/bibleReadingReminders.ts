import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { toDateKey } from '@/lib/helper';

export type ReminderPeriod = 'morning' | 'evening';

interface SyncBibleReadingReminderParams {
  permissionGranted: boolean;
  morningComplete: boolean;
  eveningComplete: boolean;
}

interface ReminderSlot {
  period: ReminderPeriod;
  hour: number;
  minute: number;
  title: string;
  body: string;
}

const REMINDER_NAMESPACE = 'visionary-bible-reading-reminder';
const ANDROID_CHANNEL_ID = 'bible-reading-reminders';
const SCHEDULE_DAYS_AHEAD = 7;

const MORNING_REMINDER_HOURS = [6, 9, 12];
const EVENING_REMINDER_HOURS = [18, 21];

let notificationsInitialized = false;

const toReminderStatus = (status: Notifications.PermissionStatus, granted: boolean) => {
  if (granted) {
    return 'granted';
  }

  if (status === Notifications.PermissionStatus.DENIED) {
    return 'denied';
  }

  return 'undetermined';
};

export const getNotificationPermissionSnapshot = async () => {
  const permissions = await Notifications.getPermissionsAsync();

  return {
    status: toReminderStatus(permissions.status, permissions.granted),
    canAskAgain: permissions.canAskAgain ?? permissions.status !== Notifications.PermissionStatus.DENIED,
  } as const;
};

export const requestNotificationPermission = async () => {
  const current = await Notifications.getPermissionsAsync();

  if (!current.granted && current.canAskAgain !== false) {
    await Notifications.requestPermissionsAsync();
  }

  return getNotificationPermissionSnapshot();
};

export const initializeBibleReadingNotifications = async () => {
  if (notificationsInitialized) {
    return;
  }

  notificationsInitialized = true;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'Bible Reading Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 220, 140, 220],
      lightColor: '#FF7A00',
      sound: 'default',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
};

const isReminderRequest = (request: Notifications.NotificationRequest) => {
  const payload = request.content.data as Record<string, unknown> | undefined;
  return payload?.namespace === REMINDER_NAMESPACE;
};

const buildReminderSlotsForOffset = (dayOffset: number): ReminderSlot[] => {
  const slots: ReminderSlot[] = [];

  if (dayOffset > 0) {
    slots.push({
      period: 'morning',
      hour: 0,
      minute: 0,
      title: 'A new day with the Word',
      body: 'Your next reading day has started. Begin your morning session when you are ready.',
    });
  }

  MORNING_REMINDER_HOURS.forEach((hour) => {
    slots.push({
      period: 'morning',
      hour,
      minute: 0,
      title: 'Morning Bible reminder',
      body: 'Your morning reading is still pending. Open Visionary and complete it in peace.',
    });
  });

  EVENING_REMINDER_HOURS.forEach((hour) => {
    slots.push({
      period: 'evening',
      hour,
      minute: 0,
      title: 'Evening Bible reminder',
      body: 'Take a moment to complete your evening reading and close the day with scripture.',
    });
  });

  return slots;
};

const buildTriggerDate = (dayOffset: number, hour: number, minute: number) => {
  const triggerDate = new Date();
  triggerDate.setSeconds(0, 0);
  triggerDate.setDate(triggerDate.getDate() + dayOffset);
  triggerDate.setHours(hour, minute, 0, 0);
  return triggerDate;
};

export const clearBibleReadingReminderSchedule = async () => {
  const pendingRequests = await Notifications.getAllScheduledNotificationsAsync();
  const reminderRequests = pendingRequests.filter(isReminderRequest);

  await Promise.all(
    reminderRequests.map((request) =>
      Notifications.cancelScheduledNotificationAsync(request.identifier),
    ),
  );
};

export const syncBibleReadingReminderSchedule = async ({
  permissionGranted,
  morningComplete,
  eveningComplete,
}: SyncBibleReadingReminderParams) => {
  await clearBibleReadingReminderSchedule();

  if (!permissionGranted) {
    return;
  }

  const now = new Date();
  const jobs: Promise<string>[] = [];

  for (let dayOffset = 0; dayOffset < SCHEDULE_DAYS_AHEAD; dayOffset += 1) {
    const slots = buildReminderSlotsForOffset(dayOffset);

    slots.forEach((slot) => {
      if (dayOffset === 0) {
        if (slot.period === 'morning' && morningComplete) {
          return;
        }

        if (slot.period === 'evening' && eveningComplete) {
          return;
        }
      }

      const triggerDate = buildTriggerDate(dayOffset, slot.hour, slot.minute);
      if (triggerDate <= now) {
        return;
      }

      jobs.push(
        Notifications.scheduleNotificationAsync({
          content: {
            title: slot.title,
            body: slot.body,
            sound: 'default',
            data: {
              namespace: REMINDER_NAMESPACE,
              period: slot.period,
              hour: slot.hour,
              minute: slot.minute,
              dateKey: toDateKey(triggerDate),
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        }),
      );
    });
  }

  await Promise.all(jobs);
};

export const openNotificationSettings = async () => {
  await Linking.openSettings();
};
