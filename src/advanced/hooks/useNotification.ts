import { useAtom } from "jotai";
import { useCallback } from "react";
import { Notification } from "../../types";
import {
  createNotification,
  removeNotification,
} from "../models/notificiation";
import { notificationsAtom } from "../stores/atoms";

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: Notification["type"] = "success") => {
      const notification = createNotification(message, type);
      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        setNotifications((prev) => removeNotification(prev, notification.id));
      }, 3000);
    },
    [setNotifications]
  );

  const remove = useCallback(
    (id: string) => {
      setNotifications((prev) => removeNotification(prev, id));
    },
    [setNotifications]
  );

  return { notifications, addNotification, remove };
};

// 알림 추가만 필요한 경우 (props drilling 제거용)
export const useAddNotification = () => {
  const { addNotification } = useNotification();
  return addNotification;
};
