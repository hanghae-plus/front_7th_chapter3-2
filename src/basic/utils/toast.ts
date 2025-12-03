export interface ToastMessage {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

type Listener = (message: ToastMessage) => void;

const listeners = new Set<Listener>();

const emit = (message: string, type: ToastMessage["type"]) => {
  const toastState = {
    id: Date.now().toString(),
    message,
    type,
  };
  listeners.forEach((listener) => listener(toastState));
};

export const toast = {
  success: (message: string) => {
    emit(message, "success");
  },
  error: (message: string) => {
    emit(message, "error");
  },
  warning: (message: string) => {
    emit(message, "warning");
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
