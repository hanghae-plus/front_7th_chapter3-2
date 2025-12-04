import { useCallback } from "react";
import { useAtom } from "jotai";
import { notificationsAtom } from "../store/atoms/notificationAtom";
import { TIMING } from "../constants";

export function useNotification(
  duration = TIMING.NOTIFICATION_AUTO_DISMISS_MS
) {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = `${Date.now()}-${Math.random()}`;
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    [duration, setNotifications]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, [setNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
