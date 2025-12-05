/**
 * 커스텀 훅
 *
 * 엔티티 훅과 범용 훅을 포함합니다.
 */

// 엔티티 훅
export { useProduct, type ProductWithUI, type UseProductReturn } from './useProduct';
export { useCoupon, type UseCouponReturn } from './useCoupon';
export { useCart, type UseCartReturn } from './useCart';

// 범용 훅
export { useLocalStorage } from './useLocalStorage';
