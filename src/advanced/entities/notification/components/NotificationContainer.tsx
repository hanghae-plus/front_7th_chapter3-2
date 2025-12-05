import NotificationToast from './NotificationToast';
import { Notification as NotificationType } from '../types';
import { Dispatch, SetStateAction } from 'react';

interface NotificationProps {
  notifications: NotificationType[];
  setNotifications: Dispatch<SetStateAction<NotificationType[]>>;
}

export function NotificationContainer({ notifications, setNotifications }: NotificationProps) {
  if (notifications.length === 0) return null;
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <NotificationToast
          key={notif.id}
          notification={notif}
          setNotifications={setNotifications}
        />
      ))}
    </div>
  );
}
