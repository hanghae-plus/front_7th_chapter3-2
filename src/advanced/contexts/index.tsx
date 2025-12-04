import { ReactNode } from 'react';
import { NotificationProvider } from './NotificationContext';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { CouponProvider } from './CouponContext';
import { SearchProvider } from './SearchContext';

/**
 * Provider를 조합하는 헬퍼 함수
 * 여러 Provider를 배열로 받아서 자동으로 중첩 구조를 만듦
 */
const composeProviders = (providers: React.FC<{ children: ReactNode }>[]) => {
  return ({ children }: { children: ReactNode }) => {
    return providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);
  };
};

/**
 * 모든 Context Provider를 하나로 합친 최상위 Provider
 * 의존성 순서를 고려하여 배치:
 * 1. NotificationProvider (다른 Provider들이 사용)
 * 2. SearchProvider (독립적)
 * 3. CartProvider, ProductProvider, CouponProvider (NotificationProvider 의존)
 */
export const AppProviders = composeProviders([
  NotificationProvider,
  SearchProvider,
  CartProvider,
  ProductProvider,
  CouponProvider,
]);

// 각 Context hook들을 re-export
export { useNotificationContext } from './NotificationContext';
export { useCartContext } from './CartContext';
export { useProductContext } from './ProductContext';
export { useCouponContext } from './CouponContext';
export { useSearchContext } from './SearchContext';

