import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useReadingPeriodLock } from '@/hooks/useReadingPeriodLock';
import { useNotificationReminderStore } from '@/store/notificationReminderStore';
import {
  initializeBibleReadingNotifications,
  syncBibleReadingReminderSchedule,
} from '@/services/notifications/bibleReadingReminders';

export const useBibleReadingReminderScheduler = () => {
  const user = useAuthStore((state) => state.user);
  const { morningComplete, eveningComplete } = useReadingPeriodLock();

  const isHydrated = useNotificationReminderStore((state) => state.isHydrated);
  const permissionStatus = useNotificationReminderStore((state) => state.permissionStatus);
  const morningReminderHours = useNotificationReminderStore((state) => state.morningReminderHours);
  const eveningReminderHours = useNotificationReminderStore((state) => state.eveningReminderHours);
  const hydrate = useNotificationReminderStore((state) => state.hydrate);
  const syncPermissionStatus = useNotificationReminderStore((state) => state.syncPermissionStatus);

  const lastScheduleSignatureRef = useRef('');
  const pendingScheduleSignatureRef = useRef('');

  useEffect(() => {
    void initializeBibleReadingNotifications().catch((error) => {
      console.warn('Unable to initialize notification channels:', error);
    });

    void hydrate().catch((error) => {
      console.warn('Unable to load notification reminder settings:', error);
    });
  }, [hydrate]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void syncPermissionStatus().catch((error) => {
          console.warn('Unable to refresh notification permission state:', error);
        });
      }
    });

    return () => subscription.remove();
  }, [syncPermissionStatus]);

  useEffect(() => {
    if (!user?.id) {
      lastScheduleSignatureRef.current = '';
      pendingScheduleSignatureRef.current = '';
      void syncBibleReadingReminderSchedule({
        permissionGranted: false,
        morningComplete: false,
        eveningComplete: false,
        morningReminderHours: [],
        eveningReminderHours: [],
      }).catch((error) => {
        console.warn('Unable to clear bible reading reminders after sign out:', error);
      });
      return;
    }

    if (!isHydrated) {
      return;
    }

    const permissionGranted = permissionStatus === 'granted';
    const nextSignature = [
      user.id,
      permissionStatus,
      morningReminderHours.join(','),
      eveningReminderHours.join(','),
      morningComplete ? '1' : '0',
      eveningComplete ? '1' : '0',
    ].join(':');

    if (lastScheduleSignatureRef.current === nextSignature) {
      return;
    }

    if (pendingScheduleSignatureRef.current === nextSignature) {
      return;
    }

    pendingScheduleSignatureRef.current = nextSignature;

    void syncBibleReadingReminderSchedule({
      permissionGranted,
      morningComplete,
      eveningComplete,
      morningReminderHours,
      eveningReminderHours,
    }).then(() => {
      if (pendingScheduleSignatureRef.current !== nextSignature) {
        return;
      }

      lastScheduleSignatureRef.current = nextSignature;
      pendingScheduleSignatureRef.current = '';
    }).catch((error) => {
      if (pendingScheduleSignatureRef.current === nextSignature) {
        pendingScheduleSignatureRef.current = '';
      }

      lastScheduleSignatureRef.current = '';
      console.warn('Unable to sync bible reading reminder schedule:', error);
    });
  }, [user?.id, isHydrated, permissionStatus, morningReminderHours, eveningReminderHours, morningComplete, eveningComplete]);
};
