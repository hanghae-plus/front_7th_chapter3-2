export type NotificationType = 'error' | 'success' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}
