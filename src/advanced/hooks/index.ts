/**
 * 커스텀 훅
 *
 * 엔티티 훅과 범용 훅을 포함합니다.
 * Jotai adapter 패턴으로 구현되어 전역 상태를 사용합니다.
 */

// 엔티티 훅 (Jotai adapter)
export { useProduct, type ProductWithUI, type UseProductReturn } from './useProduct';
export { useCoupon, type UseCouponReturn } from './useCoupon';
export { useCart, type UseCartReturn } from './useCart';
export { useNotification, type UseNotificationReturn } from './useNotification';

// 범용 훅 (더 이상 사용되지 않음, 호환성을 위해 유지)
export { useLocalStorage } from './useLocalStorage';
