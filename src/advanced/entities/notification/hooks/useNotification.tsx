import { useState } from 'react';
import { Notification } from '../types';
import { generateId } from '../../../utils/id-generator';

const NOTIFICATION_TIMEOUT = 3000;

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: 'error' | 'success' | 'warning' = 'success',
    idGenerator: () => string = () => generateId('notification')
  ) => {
    const id = idGenerator();
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, NOTIFICATION_TIMEOUT);
  };

  return {
    notifications,
    setNotifications,
    addNotification,
  };
}
