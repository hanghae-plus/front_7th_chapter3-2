import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import { useProductStore } from './stores/useProductStore';
import { useCouponStore } from './stores/useCouponStore';
import { useCartStore } from './stores/useCartStore';
import { useNotificationStore } from './stores/useNotificationStore';
import { useUIStore } from './stores/useUIStore';

// 각 테스트 전에 모든 스토어 초기화
beforeEach(() => {
  useProductStore.getState()._reset();
  useCouponStore.getState()._reset();
  useCartStore.getState()._reset();
  useNotificationStore.getState()._reset();
  useUIStore.getState()._reset();
});
