import { useCallback, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import * as cartModel from "../models/cart";
import { getRemainingStock } from "../models/product";


export const useCart = () => {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 상품 추가 함수
  const addToCart = useCallback((product: Product) => {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      //addNotification('재고가 부족합니다!', 'error');
      console.log("재고가 부족합니다!");
      return;
    }

    const newCart = cartModel.addItemToCart(cart, product);
    setCart(newCart);

  }, [cart]);

  // 상품 제거 함수
  const removeFromCart = useCallback((productId: string) => {
    setCart(cartModel.removeItemFromCart(cart, productId));
  }, [cart]);

  // 수량 변경 함수
  const updateQuantity = useCallback((products: Product[], productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      console.log(`재고는 ${maxStock}개까지만 있습니다.`);
      //addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }
    
    const newCart = cartModel.updateCartItemQuantity(cart, productId, newQuantity);
    setCart(newCart);
  }, [cart]);

  // 쿠폰 적용 함수
  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calculateTotal().totalAfterDiscount;
    
    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      console.log('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.');
      //addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }
    setSelectedCoupon(coupon);
    console.log('쿠폰이 적용되었습니다.');
    //addNotification('쿠폰이 적용되었습니다.', 'success');
  }, [cart, selectedCoupon]);

  // 총액 계산 함수
  const calculateTotal = useCallback(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  },[cart, selectedCoupon]);

  // 장바구니 비우기 함수
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    clearCart,
  };
}