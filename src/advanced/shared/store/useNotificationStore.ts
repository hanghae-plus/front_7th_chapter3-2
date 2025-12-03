import { create } from 'zustand';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
}

const initialState = {
  notifications: [] as Notification[],
};

export const useNotificationStore = create<NotificationState>((set) => ({
  ...initialState,

  addNotification: (message, type = 'success') => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));

    // 3초 후 자동 삭제
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));

// 테스트용 리셋 함수
export const resetNotificationStore = () => {
  useNotificationStore.setState(initialState);
};
