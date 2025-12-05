import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { notificationsAtom } from '../store/atoms';

export const useNotificationActions = () => {
  const setNotifications = useSetAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    },
    [setNotifications]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    },
    [setNotifications]
  );

  return {
    addNotification,
    removeNotification,
  };
};
