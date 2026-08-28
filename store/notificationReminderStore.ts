import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  getNotificationPermissionSnapshot,
  requestNotificationPermission,
} from '@/services/notifications/bibleReadingReminders';

type NotificationPermissionState = 'granted' | 'denied' | 'undetermined';

interface StoredNotificationPreference {
  clerkUserId: string | null;
  hidePromptForExistingUser: boolean;
  hasSeenSignedInHome: boolean;
}

interface NotificationReminderStore {
  permissionStatus: NotificationPermissionState;
  canAskAgain: boolean;
  isHydrated: boolean;
  clerkUserId: string | null;
  hidePromptForExistingUser: boolean;
  hasSeenSignedInHome: boolean;
  hydrate: () => Promise<void>;
  syncPermissionStatus: () => Promise<NotificationPermissionState>;
  requestPermission: () => Promise<NotificationPermissionState>;
  setHidePromptForExistingUser: (value: boolean) => Promise<void>;
  registerSignedInVisit: (clerkUserId: string) => Promise<boolean>;
}

const STORAGE_KEY = 'visionary-notification-preferences-v1';

const DEFAULT_STORED_PREFERENCES: StoredNotificationPreference = {
  clerkUserId: null,
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
      clerkUserId: typeof parsed.clerkUserId === 'string' ? parsed.clerkUserId : null,
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
  clerkUserId: null,
  hidePromptForExistingUser: false,
  hasSeenSignedInHome: false,

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }

    const stored = await readStoredPreferences();

    set({
      clerkUserId: stored.clerkUserId,
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
      clerkUserId: get().clerkUserId,
      hidePromptForExistingUser: value,
    });
  },

  registerSignedInVisit: async (clerkUserId) => {
    const current = get();

    if (current.clerkUserId !== clerkUserId) {
      set({
        clerkUserId,
        hasSeenSignedInHome: true,
        hidePromptForExistingUser: false,
      });

      await writeStoredPreferences({
        clerkUserId,
        hasSeenSignedInHome: true,
        hidePromptForExistingUser: false,
      });

      return false;
    }

    if (current.hasSeenSignedInHome) {
      return true;
    }

    set({ hasSeenSignedInHome: true });

    const stored = await readStoredPreferences();
    await writeStoredPreferences({
      ...stored,
      clerkUserId,
      hasSeenSignedInHome: true,
    });

    return false;
  },
}));
