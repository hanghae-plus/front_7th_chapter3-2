import { CartItem, Discount } from '../../types';

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율 계산
 */
export const getMaxApplicableDiscount = ({
  item,
  cart,
}: {
  item: CartItem;
  cart: CartItem[];
}) => {
  const { discounts } = item.product;
  const { quantity } = item;

  // 기본 할인율 계산
  const baseDiscount = getMaxDiscountRate({ discounts, quantity });

  // 대량 구매 보너스 할인 (10개 이상 구매 시 추가 5% 할인)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 할인
  }

  return baseDiscount;
};

/**
 * 할인 규칙 배열에서 수량에 맞는 최대 할인율 찾기
 */
export const getMaxDiscountRate = ({
  discounts,
  quantity,
}: {
  discounts: Discount[];
  quantity: number;
}) => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/**
 * 할인율을 퍼센트로 포맷팅
 */
export const formatDiscountRate = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

/**
 * 할인 적용 후 가격 계산
 */
export const applyDiscount = ({
  price,
  discountRate,
}: {
  price: number;
  discountRate: number;
}) => {
  return Math.round(price * (1 - discountRate));
};

/**
 * 할인율 계산 (원가와 할인가격으로부터)
 */
export const calculateDiscountRate = ({
  originalPrice,
  discountedPrice,
}: {
  originalPrice: number;
  discountedPrice: number;
}): number => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
