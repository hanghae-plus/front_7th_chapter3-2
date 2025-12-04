import { atom } from 'jotai';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

// Notification 상태
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type }: { message: string; type: 'error' | 'success' | 'warning' }) => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      type
    };
    set(notificationsAtom, [...notifications, newNotification]);

    // 3초 후 자동 제거
    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  }
);

// 알림 제거
export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, notifications.filter(n => n.id !== id));
  }
);

