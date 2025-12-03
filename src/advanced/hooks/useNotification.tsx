import { useCallback, useState } from "react";
import { Notification } from "../../types";

const useNotification = (timeoutMs = 3000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Date.now().toString();

    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, timeoutMs);
  }, []);

  return {
    notifications,
    setNotifications,
    addNotification,
  };
};

export default useNotification;
