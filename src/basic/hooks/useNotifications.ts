import { useState, useCallback } from 'react';
import { Notification } from '../model/notificationModels';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  }, [removeNotification]);

  return { notifications, addNotification, removeNotification };
};
