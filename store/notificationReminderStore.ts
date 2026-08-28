import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  getNotificationPermissionSnapshot,
  requestNotificationPermission,
} from '@/services/notifications/bibleReadingReminders';

type NotificationPermissionState = 'granted' | 'denied' | 'undetermined';

interface StoredNotificationPreference {
  hidePromptForExistingUser: boolean;
  hasSeenSignedInHome: boolean;
}

interface NotificationReminderStore {
  permissionStatus: NotificationPermissionState;
  canAskAgain: boolean;
  isHydrated: boolean;
  hidePromptForExistingUser: boolean;
  hasSeenSignedInHome: boolean;
  hydrate: () => Promise<void>;
  syncPermissionStatus: () => Promise<NotificationPermissionState>;
  requestPermission: () => Promise<NotificationPermissionState>;
  setHidePromptForExistingUser: (value: boolean) => Promise<void>;
  registerSignedInVisit: () => Promise<boolean>;
}

const STORAGE_KEY = 'visionary-notification-preferences-v1';

const DEFAULT_STORED_PREFERENCES: StoredNotificationPreference = {
  hidePromptForExistingUser: false,
  hasSeenSignedInHome: false,
};

const readStoredPreferences = async (): Promise<StoredNotificationPreference> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STORED_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<StoredNotificationPreference>;

    return {
      hidePromptForExistingUser: Boolean(parsed.hidePromptForExistingUser),
      hasSeenSignedInHome: Boolean(parsed.hasSeenSignedInHome),
    };
  } catch {
    return DEFAULT_STORED_PREFERENCES;
  }
};

const writeStoredPreferences = async (value: StoredNotificationPreference) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.warn('Unable to save notification preferences:', error);
  }
};

export const useNotificationReminderStore = create<NotificationReminderStore>((set, get) => ({
  permissionStatus: 'undetermined',
  canAskAgain: true,
  isHydrated: false,
  hidePromptForExistingUser: false,
  hasSeenSignedInHome: false,

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }

    const stored = await readStoredPreferences();

    set({
      hidePromptForExistingUser: stored.hidePromptForExistingUser,
      hasSeenSignedInHome: stored.hasSeenSignedInHome,
      isHydrated: true,
    });

    await get().syncPermissionStatus();
  },

  syncPermissionStatus: async () => {
    const snapshot = await getNotificationPermissionSnapshot();
    set({
      permissionStatus: snapshot.status,
      canAskAgain: snapshot.canAskAgain,
    });

    return snapshot.status;
  },

  requestPermission: async () => {
    const snapshot = await requestNotificationPermission();
    set({
      permissionStatus: snapshot.status,
      canAskAgain: snapshot.canAskAgain,
    });

    return snapshot.status;
  },

  setHidePromptForExistingUser: async (value) => {
    set({ hidePromptForExistingUser: value });

    const stored = await readStoredPreferences();
    await writeStoredPreferences({
      ...stored,
      hidePromptForExistingUser: value,
    });
  },

  registerSignedInVisit: async () => {
    if (get().hasSeenSignedInHome) {
      return true;
    }

    set({ hasSeenSignedInHome: true });

    const stored = await readStoredPreferences();
    await writeStoredPreferences({
      ...stored,
      hasSeenSignedInHome: true,
    });

    return false;
  },
}));
