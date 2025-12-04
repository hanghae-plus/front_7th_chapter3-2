/**
 * Cart Feature - useCart Hook
 * 
 * 장바구니 상태 관리 및 비즈니스 로직
 */
import { useCallback, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { CartItem } from '../entities/cart/model';
import { Coupon } from '../entities/coupon/model';
import { Product } from '../entities/product/model';
import { 
  calculateCartTotal as calcCartTotal,
  calculateItemTotal as calcItemTotal
} from '../entities/cart/utils';
import { getRemainingStock as getStock } from '../entities/product/utils';
import { canApplyCoupon } from '../entities/coupon/utils';
import { generateOrderNumber } from '../shared/utils/format';
import { cartAtom, productsAtom, selectedCouponAtom } from '../shared/store/atoms';
import { useToast } from '../shared/hooks/useToast';

export const useCart = () => {
  const products = useAtomValue(productsAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom<Coupon | null>(selectedCouponAtom);
  const { addToast } = useToast();

  // 장바구니에 상품 추가
  const addToCart = useCallback((product: Product) => {
    const remainingStock = getStock(product, cart);
    if (remainingStock <= 0) {
      addToast('재고가 부족합니다!', 'error');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        if (newQuantity > product.stock) {
          addToast(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return prevCart;
        }
      }
      
      // 재고 검증 통과
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
    
    addToast('장바구니에 담았습니다', 'success');
  }, [addToast, cart, setCart]);

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, [setCart]);

  // 수량 업데이트
  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addToast(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [addToast, products, removeFromCart, setCart]);

  // 쿠폰 적용
  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calcCartTotal(cart, selectedCoupon).totalAfterDiscount;
    
    const { canApply: isValid, reason } = canApplyCoupon(coupon, currentTotal);
    if (!isValid && reason) {
      addToast(reason, 'error');
      return;
    }

    setSelectedCoupon(coupon);
    addToast('쿠폰이 적용되었습니다.', 'success');
  }, [addToast, cart, selectedCoupon]);

  // 쿠폰 제거
  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addToast(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addToast, setCart]);

  // 남은 재고 계산
  const getRemainingStock = useCallback((product: Product): number => {
    return getStock(product, cart);
  }, [cart]);

  // 개별 아이템 총액 계산
  const calculateItemTotal = useCallback((item: CartItem): number => {
    return calcItemTotal(item, cart);
  }, [cart]);

  // 장바구니 총액 계산 (메모이제이션)
  const totals = useMemo(() => {
    return calcCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    completeOrder,
    getRemainingStock,
    calculateItemTotal,
    totals
  };
};
