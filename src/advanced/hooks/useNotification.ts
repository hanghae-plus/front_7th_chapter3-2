import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom,
  type Notification
} from '../atoms';

/**
 * useNotification 훅 반환 타입
 */
export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
}

/**
 * 알림 관리 훅 (Jotai adapter)
 *
 * @returns 알림 목록과 액션들
 */
export const useNotification = (): UseNotificationReturn => {
  const notifications = useAtomValue(notificationsAtom);
  const addNotificationAction = useSetAtom(addNotificationAtom);
  const removeNotificationAction = useSetAtom(removeNotificationAtom);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      addNotificationAction({ message, type });
    },
    [addNotificationAction]
  );

  const removeNotification = useCallback(
    (id: string) => {
      removeNotificationAction(id);
    },
    [removeNotificationAction]
  );

  return {
    notifications,
    addNotification,
    removeNotification
  };
};
