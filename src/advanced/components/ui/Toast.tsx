import { Notification } from "../../types";
import { IconClose } from "../icons";
import { useToast } from "../../utils/hooks/useToast";

export function Toast({ notification }: { notification: Notification }) {
  const { removeNotification } = useToast();

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
        notification.type === "error"
          ? "bg-red-600"
          : notification.type === "warning"
          ? "bg-yellow-600"
          : "bg-green-600"
      }`}
    >
      <span className="mr-2">{notification.message}</span>
      <button
        onClick={() => removeNotification(notification.id)}
        className="text-white hover:text-gray-200"
      >
        <IconClose className="w-4 h-4" />
      </button>
    </div>
  );
}
