import { useCallback, useState } from 'react';
import { Notification, NotificationType } from '../types/notifications';

const NOTIFICATION_DURATION = 3000;

export type AddNotification = (message: string, type?: NotificationType) => void;
type RemoveNotification = (id: string) => void;
type ClearNotifications = () => void;

const useNotifications = (duration: number = NOTIFICATION_DURATION) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification: AddNotification = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), duration);
  }, []);
  const removeNotification: RemoveNotification = useCallback(id => setNotifications(prev => prev.filter(n => n.id !== id)), []);
  const clearNotifications: ClearNotifications = useCallback(() => setNotifications([]), []);

  return { notifications, addNotification, removeNotification, clearNotifications };
};

export default useNotifications;
