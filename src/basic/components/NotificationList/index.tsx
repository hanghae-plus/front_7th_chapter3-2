import { type FC } from "react";
import CloseIcon from "../_icons/CloseIcon";
import Button from "../_common/Button";
import { Notification } from "../../models/notificiation";

interface IProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const NotificationList: FC<IProps> = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  const getNotificationClass = (type: Notification["type"]) => {
    const baseClass =
      "p-4 rounded-md shadow-md text-white flex justify-between items-center";
    const colorMap = {
      error: "bg-red-600",
      warning: "bg-yellow-600",
      success: "bg-green-600",
    };
    return `${baseClass} ${colorMap[type]}`;
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div key={notif.id} className={getNotificationClass(notif.type)}>
          <span className="mr-2">{notif.message}</span>
          <Button
            variant="ghost"
            color="danger"
            size="sm"
            onClick={() => onClose(notif.id)}>
            <CloseIcon />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
