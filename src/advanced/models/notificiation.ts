import { Notification } from "../../types";

let notificationCounter = 0;

export const createNotification = (
  message: string,
  type: Notification["type"] = "success"
): Notification => ({
  id: `${Date.now()}-${++notificationCounter}`,
  message,
  type,
});

export const removeNotification = (
  notifications: Notification[],
  id: string
): Notification[] => notifications.filter((n) => n.id !== id);
