import { Dispatch, SetStateAction } from "react";
import { IconClose } from "../icons/IconClose";
import { Notification } from "../../../../types";
import { Button } from "./Button";

const TYPE = {
  error: "bg-red-600",
  warning: "bg-yellow-600",
  success: "bg-green-600",
};

interface NotificationsProps {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export const Notifications = ({
  notifications,
  setNotifications,
}: NotificationsProps) => {
  const handleCloseNotifications = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                TYPE[notif.type]
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <Button
                onClick={() => handleCloseNotifications(notif.id)}
                variant="icon"
              >
                <IconClose stroke="#fff" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
