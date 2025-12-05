import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface NotificationsContextValue {
  notifications: Notification[];
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'warning'
  ) => void;
  removeNotification: (id: string) => void;
}

const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const notificationsState = useNotifications();

  return (
    <NotificationsContext.Provider value={notificationsState}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotificationsContext must be used within NotificationsProvider'
    );
  }
  return context;
};
