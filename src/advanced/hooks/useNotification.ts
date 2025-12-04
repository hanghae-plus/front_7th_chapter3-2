import { useCallback, useRef } from "react";
import { Notification } from "../../types";
import { atom, useAtom } from "jotai";

const atomNotifications = atom<Notification[]>([]);

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(atomNotifications);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      setNotifications((prev) => {
        // 동일한 메시지와 타입이 이미 표시 중인지 확인
        const isDuplicate = prev.some(
          (notif) => notif.message === message && notif.type === type
        );

        // 중복 알림이 있으면 추가하지 않음
        if (isDuplicate) {
          return prev;
        }

        const id = Date.now().toString();
        const newNotification = { id, message, type };

        // 알림 자동 제거 타이머 설정
        const timeoutId = setTimeout(() => {
          setNotifications((current) => current.filter((n) => n.id !== id));
          timeoutRefs.current.delete(id);
        }, 3000);

        // 타이머 참조 저장
        timeoutRefs.current.set(id, timeoutId);

        return [...prev, newNotification];
      });
    },
    []
  );

  return { notifications, setNotifications, addNotification };
};
