import { useState, useMemo, type Dispatch, type SetStateAction, useCallback } from 'react';
import { Notification } from '../entities/notification/types';
import { createContext, useContext } from 'react';
import { generateId } from '../utils/id-generator';

const NOTIFICATION_TIMEOUT = 3000;

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
    idGenerator?: () => string
  ) => void;
}
export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      type: 'error' | 'success' | 'warning' = 'success',
      idGenerator: () => string = () => generateId('notification')
    ) => {
      const id = idGenerator();
      setNotifications(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, NOTIFICATION_TIMEOUT);
    },
    []
  );

  const value = useMemo(
    () => ({ notifications, setNotifications, addNotification }),
    [notifications, addNotification]
  );
  return <NotificationContext value={value}>{children}</NotificationContext>;
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
