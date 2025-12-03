import { CartItem, Coupon } from "../../types";
import { applyCouponDiscount } from "./couponCalculations";

/**
 * 상품의 최대 적용 가능한 할인율을 계산합니다
 * @param item 장바구니 아이템
 * @param allCartItems 전체 장바구니 아이템 배열 (대량 구매 할인 계산용)
 * @returns 최대 할인율 (0~0.5)
 */
export const getMaxApplicableDiscount = (item: CartItem, allCartItems: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  // 수량별 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);

  // 대량 구매 할인 체크 (10개 이상 구매 시 추가 5% 할인)
  const hasBulkPurchase = allCartItems.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 할인
  }

  return baseDiscount;
};

/**
 * 장바구니 아이템의 총 금액을 계산합니다 (할인 적용 후)
 * @param item 장바구니 아이템
 * @param allCartItems 전체 장바구니 아이템 배열
 * @returns 할인 적용 후 총 금액
 */
export const calculateItemTotal = (item: CartItem, allCartItems: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, allCartItems);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체 금액을 계산합니다 (쿠폰 적용 전/후)
 * @param cart 장바구니 아이템 배열
 * @param selectedCoupon 선택된 쿠폰 (없으면 null)
 * @returns 할인 전 금액, 할인 후 금액
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 각 아이템의 금액 계산
  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount(totalAfterDiscount, selectedCoupon);
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템의 수량을 업데이트합니다
 * @param cart 현재 장바구니 배열
 * @param productId 상품 ID
 * @param newQuantity 새로운 수량
 * @returns 업데이트된 장바구니 배열
 */
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  // 수량이 0 이하면 해당 아이템 제거
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  // 수량 업데이트
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
};
