/**
 * Shared UI - Toast Component
 * 
 * 개별 토스트 메시지 UI
 * 
 * Features:
 * - 3가지 타입 (success, error, warning)
 * - 닫기 버튼
 * - 애니메이션 (slide-in)
 */

import { CloseIcon } from '../../assets/icons/Icons';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: (id: string) => void;
}

export const Toast = ({ id, message, type, onClose }: ToastProps) => {
  const bgColor = 
    type === 'error' ? 'bg-red-600' : 
    type === 'warning' ? 'bg-yellow-600' : 
    'bg-green-600';

  return (
    <div
      className={`${bgColor} p-4 rounded-md shadow-md text-white flex justify-between items-center animate-slide-in`}
      role="alert"
    >
      <span className="mr-2">{message}</span>
      <button 
        onClick={() => onClose(id)}
        className="text-white hover:text-gray-200 transition-colors"
        aria-label="알림 닫기"
      >
        <CloseIcon />
      </button>
    </div>
  );
};
