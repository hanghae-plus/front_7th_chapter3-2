import { atom } from "jotai";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

// 기본 상태: 알림 목록
export const notificationsAtom = atom<Notification[]>([]);

// 파생 상태: 알림이 있는지 여부
export const hasNotificationsAtom = atom((get) => {
  const notifications = get(notificationsAtom);
  return notifications.length > 0;
});
