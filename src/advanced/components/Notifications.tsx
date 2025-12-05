import { Notification } from "../../types";
import { NotificationItem } from "./ui/NotificationItem";

const Notifications = ({
  notifications,
  setNotifications,
}: {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}) => {
  return (
    notifications.length > 0 && (
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            variant={notif.type}
            message={notif.message}
            onClose={() =>
              setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
            }
          />
        ))}
      </div>
    )
  );
};

export default Notifications;
