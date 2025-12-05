import { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'error' | 'success' | 'warning';

export interface ToastProps {
  message: string;
  type: ToastType;
}

interface Notification extends ToastProps {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (notification: ToastProps) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toast = ({ message, type }: ToastProps) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {notifications.length > 0 && (
        <div
          id="toast-container"
          className="fixed top-20 right-4 z-50 space-y-2 max-w-sm"
        >
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === 'error'
                  ? 'bg-red-600'
                  : notif.type === 'warning'
                    ? 'bg-yellow-600'
                    : 'bg-green-600'
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
