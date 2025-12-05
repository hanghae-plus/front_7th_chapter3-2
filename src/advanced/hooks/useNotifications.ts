import { useCallback, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
  createdAt: number;
}

const NOTIFICATION_DURATION = 3_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) => {
      const remainingTime =
        NOTIFICATION_DURATION - (Date.now() - notification.createdAt);

      if (remainingTime <= 0) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
        return null;
      }

      return setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, remainingTime);
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [notifications]);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      const createdAt = Date.now();

      setNotifications((prev) => [...prev, { id, message, type, createdAt }]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
