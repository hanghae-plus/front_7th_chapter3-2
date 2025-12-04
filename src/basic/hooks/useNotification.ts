import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

/**
 * 알림 메시지를 관리하는 훅
 */
export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: Notification['type'] = 'success') => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type }]);

      // 3초 후 자동 제거
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
