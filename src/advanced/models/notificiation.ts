import { Notification } from "../../types";

export const createNotification = (
  message: string,
  type: Notification["type"] = "success"
): Notification => ({
  id: Date.now().toString(),
  message,
  type,
});

export const removeNotification = (
  notifications: Notification[],
  id: string
): Notification[] => notifications.filter((n) => n.id !== id);
