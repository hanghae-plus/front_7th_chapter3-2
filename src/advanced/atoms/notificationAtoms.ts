import { atom } from 'jotai';
import { Notification } from '../../types';
import { NOTIFICATION_DURATION } from '../constants';

// 기본 Atom
export const notificationsAtom = atom<Notification[]>([]);

// Write-only Atoms (액션)
export const addNotificationAtom = atom( //알림 메시지 추가
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
// 1. 현재 알림 목록 가져오기
// 2. 고유 ID 생성 (현재 시간 기반)
// 3. 새 알림 객체 생성
// 4. 알림 목록에 새 알림 추가
// 5. 지정된 시간 후 자동으로 알림 제거

export const removeNotificationAtom = atom( //알림 메시지 제거
  null,
  (get, set, id: string) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, notifications.filter(n => n.id !== id));
  }
);
// 1. 현재 알림 목록 가져오기
// 2. 해당 ID를 제외한 새 배열 생성
// 3. 알림 목록 업데이트

