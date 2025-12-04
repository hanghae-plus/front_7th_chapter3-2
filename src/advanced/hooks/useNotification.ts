import { useCallback, useState } from "react";
import {
  createNotification,
  removeNotification,
} from "../models/notificiation";
import { Notification } from "../../types";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: Notification["type"] = "success") => {
      const notification = createNotification(message, type);
      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        setNotifications((prev) => removeNotification(prev, notification.id));
      }, 3000);
    },
    []
  );
  const remove = useCallback((id: string) => {
    setNotifications((prev) => removeNotification(prev, id));
  }, []);

  return { notifications, addNotification, remove };
};
