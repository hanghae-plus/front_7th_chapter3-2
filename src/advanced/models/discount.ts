import { CartItem, Discount } from "../../types";

/**
 * 특정 수량에 대한 최대 할인율을 계산하는 순수 함수
 * @param discounts 할인 규칙 배열
 * @param quantity 구매 수량
 * @returns 최대 할인율 (0 ~ 1)
 */
export const getMaxDiscountRate = (
  discounts: Discount[],
  quantity: number
): number => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/**
 * 대량 구매 할인 여부를 확인하는 순수 함수
 * @param cart 장바구니 아이템 배열
 * @returns 대량 구매 여부 (10개 이상인 아이템이 있는지)
 */
export const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some((cartItem) => cartItem.quantity >= 10);
};

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산하는 순수 함수
 * (상품 할인 + 대량 구매 할인)
 * @param cart 장바구니 아이템 배열
 * @param item 계산할 장바구니 아이템
 * @returns 최대 할인율 (0 ~ 0.5)
 */
export const getMaxApplicableDiscount = (
  cart: CartItem[],
  item: CartItem
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = getMaxDiscountRate(discounts, quantity);

  if (hasBulkPurchase(cart)) {
    // 대량 구매 시 추가 5% 할인 (최대 50%까지)
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

/**
 * 할인된 가격을 계산하는 순수 함수
 * @param price 원가
 * @param quantity 수량
 * @param discountRate 할인율 (0 ~ 1)
 * @returns 할인된 가격
 */
export const calculateDiscountedPrice = (
  price: number,
  quantity: number,
  discountRate: number
): number => {
  return Math.round(price * quantity * (1 - discountRate));
};

