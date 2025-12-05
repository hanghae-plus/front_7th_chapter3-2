// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열 -
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수 -
// - removeFromCart: 상품 제거 함수 -
// - updateQuantity: 수량 변경 함수 -
// - applyCoupon: 쿠폰 적용 함수 -
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수 -
// - clearCart: 장바구니 비우기 함수

import { useCallback, useMemo, useState } from "react";
import { CartItem, Coupon, ProductWithUI } from "../../types";
import {
  calculateCartTotal,
  getRemainingStock,
  removeItemFromCart,
} from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useCart({
  products,
  onMessage,
}: {
  products: ProductWithUI[];
  onMessage: (message: string, type?: "error" | "success" | "warning") => void;
}) {
  // TODO: 구현
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        onMessage("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            onMessage(`재고는 ${product.stock}개까지만 있습니다.`, "error");
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      onMessage("장바구니에 담았습니다", "success");
    },
    [cart, onMessage, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        onMessage(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, onMessage, getRemainingStock]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        onMessage(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      onMessage("쿠폰이 적용되었습니다.", "success");
    },
    [onMessage, calculateCartTotal]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const clearSelectedCouponByCode = useCallback(
    (code: string) => {
      if (selectedCoupon?.code === code) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon]
  );

  // 파생 상태: 장바구니 총 아이템 개수
  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return {
    value: cart,
    selectedCoupon: selectedCoupon,
    totalItemCount: totalItemCount,
    add: addToCart,
    remove: removeFromCart,
    updateQuantity: updateQuantity,
    apply: applyCoupon,
    clearCart: clearCart,
    clearSelectedCoupon: clearSelectedCoupon,
    clearSelectedCouponByCode: clearSelectedCouponByCode,
  };
}
