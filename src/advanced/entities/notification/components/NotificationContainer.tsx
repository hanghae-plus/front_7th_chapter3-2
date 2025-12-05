import NotificationToast from './NotificationToast';
import { useNotificationContext } from '../../../providers/NotificationProvider';

export function NotificationContainer() {
  const { notifications } = useNotificationContext();
  if (notifications.length === 0) return null;
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <NotificationToast key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
