// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//

import { useCallback, useMemo, useState } from "react";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock,
  calculateItemTotal,
} from "../models/cart";
import type { Coupon, CartItem } from "../../types";
import type { ProductWithUI } from "./useProducts";
import { toast } from "../utils/toast";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCart = () => {
  const [cart, setCart, removeCart] = useLocalStorage<CartItem[]>("cart", initialCart);

  // 이게 여기 있어야만 하는지????
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        toast.error("재고가 부족합니다!");
        return;
      }

      setCart((prevCart) => addItemToCart(prevCart, product));

      toast.success("장바구니에 담았습니다");
    },
    [cart, setCart]
  );
  const remainingStock = useCallback(
    (product: ProductWithUI) => getRemainingStock(product, cart),
    [cart]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => removeItemFromCart(prevCart, productId));
  }, [setCart]);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        toast.error("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.");
        return;
      }

      setSelectedCoupon(coupon);
      toast.success("쿠폰이 적용되었습니다.");
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = cart.find(({ product }) => product.id === productId)?.product;
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        toast.error(`재고는 ${maxStock}개까지만 있습니다.`);
        return;
      }

      setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
    },
    [cart, setCart]
  );

  const totals = useMemo(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const calcItemTotal = useCallback(
    (item: CartItem) => {
      return calculateItemTotal(item, cart);
    },
    [cart]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    toast.success(`주문이 완료되었습니다. 주문번호: ${orderNumber}`);
    setCart(initialCart);
    setSelectedCoupon(null);
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart(initialCart);
    removeCart();
  }, [setCart, removeCart]);

  return {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    totals,
    remainingStock,
    calcItemTotal,
    completeOrder,
    clearCart,
  };
};

const initialCart: CartItem[] = [];
