import type { CartItem, Discount } from '../../types';

/**
 * 장바구니에 대량 구매 상품이 있는지 확인합니다.
 *
 * @param cart - 장바구니 아이템 배열
 * @returns 10개 이상 구매한 상품이 있으면 true
 */
export const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some(item => item.quantity >= 10);
};

/**
 * 할인 목록에서 최대 할인율을 반환합니다.
 *
 * @param discounts - 할인 목록
 * @returns 최대 할인율 (0 ~ 1)
 */
export const getMaxDiscountRate = (discounts: Discount[]): number => {
  if (discounts.length === 0) return 0;
  return Math.max(...discounts.map(d => d.rate));
};

/**
 * 최대 할인율을 퍼센트로 반환합니다.
 *
 * @param discounts - 할인 목록
 * @returns 최대 할인율 (퍼센트, 0 ~ 100)
 */
export const getMaxDiscountPercent = (discounts: Discount[]): number => {
  return Math.round(getMaxDiscountRate(discounts) * 100);
};

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다.
 *
 * @param item - 장바구니 아이템
 * @param cart - 장바구니 (대량 구매 보너스 계산용, 선택사항)
 * @returns 적용 가능한 최대 할인율 (0 ~ 1)
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart?: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 보너스: 장바구니에 10개 이상 구매한 상품이 있으면 +5% (최대 50%)
  if (cart && hasBulkPurchase(cart)) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

/**
 * 장바구니 아이템의 할인 적용 후 금액을 계산합니다.
 *
 * @param item - 장바구니 아이템
 * @param cart - 장바구니 (대량 구매 보너스 계산용, 선택사항)
 * @returns 할인이 적용된 금액
 */
export const calculateDiscountedPrice = (
  item: CartItem,
  cart?: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 아이템에 적용된 할인율을 퍼센트로 계산합니다.
 *
 * @param item - 장바구니 아이템
 * @param cart - 장바구니 (대량 구매 보너스 계산용, 선택사항)
 * @returns 적용된 할인율 (퍼센트, 0 ~ 100)
 */
export const getAppliedDiscountRate = (
  item: CartItem,
  cart?: CartItem[]
): number => {
  const originalPrice = item.product.price * item.quantity;
  const discountedPrice = calculateDiscountedPrice(item, cart);

  if (originalPrice === 0) return 0;

  return Math.round((1 - discountedPrice / originalPrice) * 100);
};
