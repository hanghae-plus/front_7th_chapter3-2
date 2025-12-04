/**
 * Shared Hook - useNotification
 * 
 * 알림 상태 관리 및 자동 제거 타이머
 */

import { useState, useCallback } from 'react';
import { Notification } from '../../../types';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    message: string, 
    type: 'error' | 'success' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification
  };
};
