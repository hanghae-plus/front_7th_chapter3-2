import { useToastStore, ToastMessage } from '../stores';

interface UseToastReturn {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

/**
 * 토스트 알림 훅
 * Zustand Store를 래핑하여 도메인 인터페이스 제공
 */
export const useToast = (): UseToastReturn => {
  const toasts = useToastStore((state) => state.toasts);
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);

  return {
    toasts,
    addToast,
    removeToast,
  };
};

// 타입 재export (하위 호환성)
export type { ToastMessage };
