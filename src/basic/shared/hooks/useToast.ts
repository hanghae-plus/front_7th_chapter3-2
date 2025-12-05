import { useCallback, useState } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToast) => prevToast.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success') => {
      const id = crypto.randomUUID();

      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id,
          message,
          type,
        },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast],
  );

  return { toasts, addToast, removeToast };
};
