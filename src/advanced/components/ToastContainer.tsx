import { Toast } from "./Toast";
import { useNotificationStore } from "../store/useNotificationStore";

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <Toast
          key={notif.id}
          id={notif.id}
          type={notif.type}
          message={notif.message}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

