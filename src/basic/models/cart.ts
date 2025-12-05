// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산 -
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산 -
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액) -
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. removeItemFromCart(cart, productId): 상품 제거
// 7. getRemainingStock(product, cart): 남은 재고 계산

import { CartItem, Coupon, Product } from "../../types";
import { calculateCouponDiscount, getMaxApplicableDiscount } from "./discount";

export const calculateItemTotal = (
  cart: CartItem[],
  item: CartItem
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(cart, item);

  return Math.round(price * quantity * (1 - discount));
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(cart, item);
  });

  if (selectedCoupon) {
    const couponDiscount = calculateCouponDiscount(
      totalAfterDiscount,
      selectedCoupon
    );
    totalAfterDiscount = Math.max(0, totalAfterDiscount - couponDiscount);
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

// TODO: 구현
