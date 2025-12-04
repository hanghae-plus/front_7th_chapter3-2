/**
 * Toast Feature - useToast Hook
 * 
 * 토스트 메시지 관리
 * 
 * Features:
 * - 토스트 추가/제거
 * - 자동 제거 타이머 (3초)
 * - 타입별 메시지 (success, error, warning)
 */

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    message: string, 
    type: 'error' | 'success' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // 3초 후 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast
  };
};
