import { create } from 'zustand';
import { Notification, NotificationType } from '../types/notifications';

const NOTIFICATION_DURATION = 3000;

interface NotificationsContext {
  notifications: Notification[];
}

interface NotificationsActions {
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface NotificationsStore {
  context: NotificationsContext;
  actions: NotificationsActions;
}

const initialContext: NotificationsContext = {
  notifications: []
};

export const useNotifications = create<NotificationsStore>(set => ({
  context: {
    ...initialContext
  },
  actions: {
    addNotification: (message, type = 'success') => {
      const id = Date.now().toString();

      set(({ context }) => ({
        context: {
          notifications: [...context.notifications.filter(n => n.message !== message), { id, message, type }]
        }
      }));

      setTimeout(() => {
        set(({ context }) => ({
          context: { notifications: context.notifications.filter(n => n.id !== id) }
        }));
      }, NOTIFICATION_DURATION);
    },
    removeNotification: id =>
      set(({ context }) => ({
        context: { notifications: context.notifications.filter(n => n.id !== id) }
      })),
    clearNotifications: () => set({ context: { ...initialContext } })
  }
}));

export const notificationsContext = () => useNotifications(({ context }) => context);
export const notificationsActions = () => useNotifications(({ actions }) => actions);
