import React from 'react';

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
  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
        type === 'error'
          ? 'bg-red-600'
          : type === 'warning'
          ? 'bg-yellow-600'
          : 'bg-green-600'
      }`}
    >
      <span className="mr-2">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="text-white hover:text-gray-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
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
