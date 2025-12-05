import React from 'react';
import { Toast } from '../primitives/Toast';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

interface NotificationItemProps {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  message,
  type,
  onClose,
}) => {
  return <Toast message={message} variant={type} onClose={() => onClose(id)} />;
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <NotificationItem key={notif.id} {...notif} onClose={onClose} />
      ))}
    </div>
  );
};
