import { create } from 'zustand';
import { NOTIFICATION_DURATION } from '../constants';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

interface AppState {
  // Navigation
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  toggleAdmin: () => void;

  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  isAdmin: false,
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),

  // Search
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Notifications
  notifications: [],
  addNotification: (message, type = 'success') => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, NOTIFICATION_DURATION);
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
