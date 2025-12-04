import { useCallback, useMemo } from 'react';
import { CartItem, Product, Coupon } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import {
  calculateCartTotal,
  calculateItemTotal,
  updateCartItemQuantity,
  getRemainingStock,
  getTotalItemCount,
} from '../utils/cartUtils';

export interface UseCartReturn {
  // 상태
  cart: CartItem[];

  // 파생 데이터
  totalItemCount: number;

  // 액션
  addToCart: (product: Product) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, maxStock: number) => {
    success: boolean;
    message?: string;
  };
  clearCart: () => void;

  // 헬퍼
  getCartTotal: (selectedCoupon: Coupon | null) => ReturnType<typeof calculateCartTotal>;
  getItemTotal: (item: CartItem) => number;
  getRemainingStock: (product: Product) => number;
}

/**
 * 장바구니 상태를 관리하는 엔티티 훅
 */
export function useCart(): UseCartReturn {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  // 파생 데이터
  const totalItemCount = useMemo(() => getTotalItemCount(cart), [cart]);

  // 액션
  const addToCart = useCallback(
    (product: Product) => {
      const remaining = getRemainingStock(product, cart);

      if (remaining <= 0) {
        return { success: false, message: '재고가 부족합니다!' };
      }

      const existingItem = cart.find(item => item.product.id === product.id);
      if (existingItem && existingItem.quantity >= product.stock) {
        return {
          success: false,
          message: `재고는 ${product.stock}개까지만 있습니다.`,
        };
      }

      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });

      return { success: true, message: '장바구니에 담았습니다' };
    },
    [cart, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, maxStock: number) => {
      if (newQuantity <= 0) {
        setCart(prev => prev.filter(item => item.product.id !== productId));
        return { success: true };
      }

      if (newQuantity > maxStock) {
        return {
          success: false,
          message: `재고는 ${maxStock}개까지만 있습니다.`,
        };
      }

      setCart(prev => updateCartItemQuantity(prev, productId, newQuantity));
      return { success: true };
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // 헬퍼
  const getCartTotal = useCallback(
    (selectedCoupon: Coupon | null) => calculateCartTotal(cart, selectedCoupon),
    [cart]
  );

  const getItemTotal = useCallback(
    (item: CartItem) => calculateItemTotal(item, cart),
    [cart]
  );

  const getRemainingStockForProduct = useCallback(
    (product: Product) => getRemainingStock(product, cart),
    [cart]
  );

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemTotal,
    getRemainingStock: getRemainingStockForProduct,
  };
}
