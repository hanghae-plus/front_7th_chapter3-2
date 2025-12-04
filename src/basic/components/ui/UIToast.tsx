import { CloseIcon } from "../icons";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

interface UIToastProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const getToastBgColor = (type: Notification["type"]) => {
  const colors = {
    error: "bg-red-600",
    warning: "bg-yellow-600",
    success: "bg-green-600",
  };
  return colors[type];
};

export const UIToast = ({ notifications, onClose }: UIToastProps) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${getToastBgColor(
            notif.type
          )}`}
        >
          <span className="mr-2">{notif.message}</span>
          <button
            onClick={() => onClose(notif.id)}
            className="text-white hover:text-gray-200"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
