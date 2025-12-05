import { useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import * as cartModel from "../models/cart";
import { getRemainingStock } from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCart = (
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void
) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 상품 추가 함수
  const addToCart = useCallback((product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }

    const newCart = cartModel.addItemToCart(cart, product);
    setCart(newCart);
    addNotification('장바구니에 담았습니다', 'success');
  }, [cart, setCart, addNotification]);

  // 상품 제거 함수
  const removeFromCart = useCallback((productId: string) => {
    setCart(cartModel.removeItemFromCart(cart, productId));
  }, [cart, setCart]);

  // 수량 변경 함수
  const updateQuantity = useCallback((products: Product[], productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    const newCart = cartModel.updateCartItemQuantity(cart, productId, newQuantity);
    setCart(newCart);
  }, [cart, setCart, removeFromCart, addNotification]);

  // 쿠폰 적용 함수
  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calculateTotal().totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }
    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  }, [cart, selectedCoupon, addNotification]);

  // 총액 계산 함수
  const calculateTotal = useCallback(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  },[cart, selectedCoupon]);

  // 장바구니 비우기 함수
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  // 주문 완료 함수
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart, addNotification]);

  return {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    clearCart,
    completeOrder,
  };
}
