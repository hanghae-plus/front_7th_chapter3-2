import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { notificationsAtom, removeNotificationAtom } from '../../store/notificationAtoms';
import { Notification as NotificationType } from '../../model/notificationModels';

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const { id, message, type } = notification;
  const baseClasses = "p-4 rounded-md shadow-md text-white flex justify-between items-center";
  const typeClasses = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="mr-2">{message}</span>
      <button 
        onClick={() => onClose(id)}
        className="text-white hover:text-gray-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const [notifications] = useAtom(notificationsAtom);
  const removeNotification = useSetAtom(removeNotificationAtom);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          notification={notif}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;