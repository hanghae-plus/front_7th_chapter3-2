import { useSetAtom } from "jotai";
import { notificationsAtom } from "../atoms/notifications";
import { NotificationType } from "../atoms/notifications";

export function useNotification() {
  const setNotifications = useSetAtom(notificationsAtom);

  const addNotification = (
    msg: string,
    type: "error" | "success" | "warning" = "success"
  ) => {
    const id = String(Date.now());
    const newNotification: NotificationType = { id, message: msg, type };

    setNotifications((prev) => {
      const updated = [...prev, newNotification];
      return updated;
    });

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { addNotification, clearNotification };
}
