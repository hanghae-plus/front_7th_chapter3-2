export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

type NotificationListener = (notifications: Notification[]) => void;

class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Notification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private nextId = 1;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    // 구독 즉시 현재 상태 전달
    listener(this.notifications);

    // unsubscribe 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.notifications));
  }

  addNotification(message: string, type: Notification['type'] = 'info'): void {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type,
    };

    this.notifications = [...this.notifications, notification];
    this.notify();

    // 3초 후 자동 제거
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 3000);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clearAll(): void {
    this.notifications = [];
    this.notify();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }
}

// 싱글톤 인스턴스 export
export const notificationManager = NotificationManager.getInstance();

// 편의 함수들 export
export const addNotification = (
  message: string,
  type: Notification['type'] = 'info'
) => {
  notificationManager.addNotification(message, type);
};

export const removeNotification = (id: number) => {
  notificationManager.removeNotification(id);
};

export const clearAllNotifications = () => {
  notificationManager.clearAll();
};
