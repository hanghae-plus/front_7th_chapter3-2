/**
 * Shared UI - ToastContainer Component
 * 
 * 토스트 메시지 목록 컨테이너
 * 
 * Features:
 * - 화면 우측 상단에 고정
 * - 여러 토스트를 세로로 표시
 * - 자동 제거 (부모에서 타이머 관리)
 */

import { Toast, ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
