import { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Notification } from "../types";

export interface ToastContextType {
  notifications: Notification[];
  notify: (message: string, type?: "error" | "success" | "warning") => void;
  removeNotification: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  notifications: [],
  notify: () => {},
  removeNotification: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{ notifications, notify, removeNotification }}
    >
      {children}
    </ToastContext.Provider>
  );
};
