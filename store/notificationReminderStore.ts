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
  morningReminderHours: number[];
  eveningReminderHours: number[];
}

interface NotificationReminderStore {
  permissionStatus: NotificationPermissionState;
  canAskAgain: boolean;
  isHydrated: boolean;
  clerkUserId: string | null;
  hidePromptForExistingUser: boolean;
  hasSeenSignedInHome: boolean;
  morningReminderHours: number[];
  eveningReminderHours: number[];
  hydrate: () => Promise<void>;
  syncPermissionStatus: () => Promise<NotificationPermissionState>;
  requestPermission: () => Promise<NotificationPermissionState>;
  setHidePromptForExistingUser: (value: boolean) => Promise<void>;
  registerSignedInVisit: (clerkUserId: string) => Promise<boolean>;
  setReminderHours: (period: 'morning' | 'evening', hours: number[]) => Promise<void>;
  resetReminderHours: () => Promise<void>;
}

const STORAGE_KEY = 'visionary-notification-preferences-v1';

const DEFAULT_STORED_PREFERENCES: StoredNotificationPreference = {
  clerkUserId: null,
  hidePromptForExistingUser: false,
  hasSeenSignedInHome: false,
  morningReminderHours: [],
  eveningReminderHours: [],
};

type PersistedPreferenceState = Pick<
  NotificationReminderStore,
  'clerkUserId' | 'hidePromptForExistingUser' | 'hasSeenSignedInHome' | 'morningReminderHours' | 'eveningReminderHours'
>;

let preferenceWriteQueue: Promise<void> = Promise.resolve();

const sanitizeReminderHours = (hours: unknown): number[] => {
  if (!Array.isArray(hours)) {
    return [];
  }

  const uniqueSorted = Array.from(
    new Set(
      hours
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value >= 0 && value <= 23),
    ),
  ).sort((a, b) => a - b);

  return uniqueSorted;
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
      morningReminderHours: sanitizeReminderHours(parsed.morningReminderHours),
      eveningReminderHours: sanitizeReminderHours(parsed.eveningReminderHours),
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

const queuePreferenceSnapshotWrite = (getSnapshot: () => PersistedPreferenceState) => {
  preferenceWriteQueue = preferenceWriteQueue
    .catch(() => undefined)
    .then(async () => {
      const stored = await readStoredPreferences();
      const snapshot = getSnapshot();

      await writeStoredPreferences({
        ...stored,
        clerkUserId: snapshot.clerkUserId,
        hidePromptForExistingUser: snapshot.hidePromptForExistingUser,
        hasSeenSignedInHome: snapshot.hasSeenSignedInHome,
        morningReminderHours: sanitizeReminderHours(snapshot.morningReminderHours),
        eveningReminderHours: sanitizeReminderHours(snapshot.eveningReminderHours),
      });
    });

  return preferenceWriteQueue;
};

export const useNotificationReminderStore = create<NotificationReminderStore>((set, get) => ({
  permissionStatus: 'undetermined',
  canAskAgain: true,
  isHydrated: false,
  clerkUserId: null,
  hidePromptForExistingUser: false,
  hasSeenSignedInHome: false,
  morningReminderHours: [],
  eveningReminderHours: [],

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }

    const stored = await readStoredPreferences();

    set({
      clerkUserId: stored.clerkUserId,
      hidePromptForExistingUser: stored.hidePromptForExistingUser,
      hasSeenSignedInHome: stored.hasSeenSignedInHome,
      morningReminderHours: stored.morningReminderHours,
      eveningReminderHours: stored.eveningReminderHours,
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
    await queuePreferenceSnapshotWrite(() => {
      const current = get();
      return {
        clerkUserId: current.clerkUserId,
        hidePromptForExistingUser: current.hidePromptForExistingUser,
        hasSeenSignedInHome: current.hasSeenSignedInHome,
        morningReminderHours: current.morningReminderHours,
        eveningReminderHours: current.eveningReminderHours,
      };
    });
  },

  registerSignedInVisit: async (clerkUserId) => {
    const current = get();

    if (current.clerkUserId !== clerkUserId) {
      set({
        clerkUserId,
        hasSeenSignedInHome: true,
        hidePromptForExistingUser: false,
        morningReminderHours: [],
        eveningReminderHours: [],
      });

      await queuePreferenceSnapshotWrite(() => {
        const current = get();
        return {
          clerkUserId: current.clerkUserId,
          hidePromptForExistingUser: current.hidePromptForExistingUser,
          hasSeenSignedInHome: current.hasSeenSignedInHome,
          morningReminderHours: current.morningReminderHours,
          eveningReminderHours: current.eveningReminderHours,
        };
      });

      return false;
    }

    if (current.hasSeenSignedInHome) {
      return true;
    }

    set({ hasSeenSignedInHome: true });

    await queuePreferenceSnapshotWrite(() => {
      const current = get();
      return {
        clerkUserId: current.clerkUserId,
        hidePromptForExistingUser: current.hidePromptForExistingUser,
        hasSeenSignedInHome: current.hasSeenSignedInHome,
        morningReminderHours: current.morningReminderHours,
        eveningReminderHours: current.eveningReminderHours,
      };
    });

    return false;
  },

  setReminderHours: async (period, hours) => {
    const sanitizedHours = sanitizeReminderHours(hours);

    if (period === 'morning') {
      set({ morningReminderHours: sanitizedHours });
    } else {
      set({ eveningReminderHours: sanitizedHours });
    }

    await queuePreferenceSnapshotWrite(() => {
      const current = get();
      return {
        clerkUserId: current.clerkUserId,
        hidePromptForExistingUser: current.hidePromptForExistingUser,
        hasSeenSignedInHome: current.hasSeenSignedInHome,
        morningReminderHours: current.morningReminderHours,
        eveningReminderHours: current.eveningReminderHours,
      };
    });
  },

  resetReminderHours: async () => {
    set({
      morningReminderHours: [],
      eveningReminderHours: [],
    });

    await queuePreferenceSnapshotWrite(() => {
      const current = get();
      return {
        clerkUserId: current.clerkUserId,
        hidePromptForExistingUser: current.hidePromptForExistingUser,
        hasSeenSignedInHome: current.hasSeenSignedInHome,
        morningReminderHours: current.morningReminderHours,
        eveningReminderHours: current.eveningReminderHours,
      };
    });
  },
}));
