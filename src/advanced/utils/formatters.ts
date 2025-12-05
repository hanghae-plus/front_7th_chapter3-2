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
 * 퍼센트를 포맷팅합니다.
 *
 * @param percent - 퍼센트 값 (0 ~ 100)
 * @returns 포맷팅된 퍼센트 문자열 (예: "10%")
 */
export const formatPercent = (percent: number): string => {
  return `${percent}%`;
};

/**
 * 할인율을 포맷팅합니다.
 *
 * @param rate - 할인율 (0 ~ 1)
 * @returns 포맷팅된 할인율 문자열 (예: "10% 할인")
 */
export const formatDiscountRate = (rate: number): string => {
  return `${Math.round(rate * 100)}% 할인`;
};
