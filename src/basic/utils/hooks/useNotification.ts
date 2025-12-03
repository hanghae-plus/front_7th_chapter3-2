import { useEffect, useState, useCallback } from "react";
import { toast } from "../toast";
import type { ToastMessage } from "../toast";

export const useNotification = (duration = 3000) => {
  const [notifications, setNotifications] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setNotifications((prev) => [...prev, newToast]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newToast.id));
      }, duration);
    });
  }, [duration]);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, remove };
};
