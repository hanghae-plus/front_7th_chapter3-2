import { create } from "zustand";
import { Notification } from "../../types";

type NotificationState = {
  notifications: Notification[];
};

type NotificationActions = {
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  removeNotification: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  reset: () => void;
};

export type NotificationStore = NotificationState & NotificationActions;

const DEFAULT_TIMEOUT = 3000;

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (message, type = "success") => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // 자동으로 3초 후 제거
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, DEFAULT_TIMEOUT);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  setNotifications: (notifications) => {
    set({ notifications });
  },

  reset: () => {
    set({ notifications: [] });
  },
}));
