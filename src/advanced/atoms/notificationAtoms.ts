import { atom } from 'jotai';

/**
 * 알림 타입 정의
 */
export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

/**
 * 알림 목록 atom
 */
export const notificationsAtom = atom<Notification[]>([]);

/**
 * 알림 추가 액션 atom
 */
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    { message, type = 'success' }: { message: string; type?: 'error' | 'success' | 'warning' }
  ) => {
    const id = Date.now().toString();
    const notifications = get(notificationsAtom);

    set(notificationsAtom, [...notifications, { id, message, type }]);

    // 3초 후 자동 제거
    setTimeout(() => {
      // Jotai set은 업데이터 함수를 지원하지 않으므로 get으로 현재 상태를 가져옴
      const currentNotifications = get(notificationsAtom);
      set(notificationsAtom, currentNotifications.filter(n => n.id !== id));
    }, 3000);
  }
);

/**
 * 알림 제거 액션 atom
 */
export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  const notifications = get(notificationsAtom);
  set(
    notificationsAtom,
    notifications.filter(n => n.id !== id)
  );
});
