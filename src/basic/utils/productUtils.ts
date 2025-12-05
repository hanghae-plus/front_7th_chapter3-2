import { Discount } from '../../types';

/**
 * 가격을 포맷팅합니다.
 *
 * @param price - 가격
 * @returns 포맷팅된 가격 문자열 (예: "₩10,000")
 */
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 관리자용 가격 포맷팅입니다.
 *
 * @param price - 가격
 * @returns 포맷팅된 가격 문자열 (예: "10,000원")
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
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
