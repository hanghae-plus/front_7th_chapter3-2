import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

interface NotificationState {
  notifications: Notification[];

  // 메서드
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (message, type = "success") => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      }));
    }, 3000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
}));
