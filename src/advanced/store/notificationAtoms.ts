import { atom } from 'jotai';
import { Notification } from '../model/notificationModels';

// 기본 아톰: 알림 목록을 저장
export const notificationsAtom = atom<Notification[]>([]);

// 쓰기 전용 아톰: 알림 추가 로직
export const addNotificationAtom = atom(
  null, // 첫 번째 인자는 getter이므로 null
  (get, set, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type: 'success', // 기본 타입을 'success'로 설정하거나, 인자로 받을 수 있습니다.
    };
    set(notificationsAtom, [...get(notificationsAtom), newNotification]);

    // 3초 후에 알림을 자동으로 제거
    setTimeout(() => {
      set(removeNotificationAtom, newNotification.id);
    }, 3000);
  }
);

// 쓰기 전용 아톰: 알림 제거 로직
export const removeNotificationAtom = atom(
  null, // 첫 번째 인자는 getter이므로 null
  (get, set, id: number) => {
    set(
      notificationsAtom,
      get(notificationsAtom).filter((n) => n.id !== id)
    );
  }
);
