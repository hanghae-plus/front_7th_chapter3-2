import {
  Notification,
  notificationManager,
  removeNotification as removeNotificationGlobal,
} from '@/models/notification';
import { useEffect, useState } from 'react';

/**
 * 전역 NotificationManager를 구독하는 Hook
 * 어디서든 addNotification을 import해서 사용 가능
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationManager.getNotifications()
  );

  useEffect(() => {
    // NotificationManager 구독
    const unsubscribe = notificationManager.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    // cleanup: 컴포넌트 언마운트 시 구독 해제
    return unsubscribe;
  }, []);

  return {
    notifications,
    removeNotification: removeNotificationGlobal,
  };
};
