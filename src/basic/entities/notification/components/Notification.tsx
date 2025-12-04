import NotificationToast from './NotificationToast';
import { Notification as NotificationType } from '../types';

interface NotificationProps {
  notifications: NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
}

export function Notification({ notifications, setNotifications }: NotificationProps) {
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
