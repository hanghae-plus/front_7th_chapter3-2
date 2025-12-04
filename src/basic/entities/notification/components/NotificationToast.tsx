import { type Notification } from '../types';
import { Dispatch, SetStateAction } from 'react';

interface NotificationToastProps {
  notification: Notification;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export default function NotificationToast({
  notification,
  setNotifications,
}: NotificationToastProps) {
  const handleClose = () => {
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
        notification.type === 'error'
          ? 'bg-red-600'
          : notification.type === 'warning'
            ? 'bg-yellow-600'
            : 'bg-green-600'
      }`}
    >
      <span className="mr-2">{notification.message}</span>
      <button onClick={handleClose} className="text-white hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
