import { create } from "zustand";
import { Notification } from "../types/types";

interface NotificationStoreState {
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStoreState>(
  (set, get) => ({
    notifications: [],

    addNotification: (
      message: string,
      type: "error" | "success" | "warning" = "success"
    ) => {
      const id = Date.now().toString();
      const newNotification = { id, message, type };

      set((state) => ({
        notifications: [...state.notifications, newNotification],
      }));

      setTimeout(() => {
        get().removeNotification(id);
      }, 3000);
    },

    removeNotification: (id: string) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    },
  })
);
