import { atom } from 'jotai';
import { Notification } from '../components/ui/Toast';
import { NOTIFICATION_DURATION } from '../constants';

// 기본 Atom
export const notificationsAtom = atom<Notification[]>([]);

// Write-only Atoms (액션)
export const addNotificationAtom = atom(
  null,
  (get, set, message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const notifications = get(notificationsAtom);
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };
    
    set(notificationsAtom, [...notifications, newNotification]);
    
    // 자동 제거
    setTimeout(() => {
      const currentNotifications = get(notificationsAtom);
      set(notificationsAtom, currentNotifications.filter(n => n.id !== id));
    }, NOTIFICATION_DURATION);
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, notifications.filter(n => n.id !== id));
  }
);

