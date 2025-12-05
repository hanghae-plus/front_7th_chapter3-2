/**
 * 숫자만 포함된 문자열인지 검증합니다.
 *
 * @param value - 검증할 문자열
 * @returns 숫자만 포함되어 있으면 true
 */
export const isNumericString = (value: string): boolean => {
  return value === '' || /^\d+$/.test(value);
};

/**
 * 유효한 가격인지 검증합니다.
 *
 * @param price - 검증할 가격
 * @returns 0 이상의 정수이면 true
 */
export const isValidPrice = (price: number): boolean => {
  return Number.isInteger(price) && price >= 0;
};

/**
 * 유효한 재고인지 검증합니다.
 *
 * @param stock - 검증할 재고
 * @param max - 최대 재고 (기본값: 9999)
 * @returns 0 ~ max 사이의 정수이면 true
 */
export const isValidStock = (stock: number, max = 9999): boolean => {
  return Number.isInteger(stock) && stock >= 0 && stock <= max;
};

/**
 * 유효한 할인율인지 검증합니다.
 *
 * @param rate - 검증할 할인율 (0 ~ 1)
 * @returns 0 ~ 1 사이의 숫자이면 true
 */
export const isValidDiscountRate = (rate: number): boolean => {
  return rate >= 0 && rate <= 1;
};

/**
 * 빈 문자열인지 검증합니다.
 *
 * @param value - 검증할 문자열
 * @returns 빈 문자열이거나 공백만 있으면 true
 */
export const isEmpty = (value: string): boolean => {
  return value.trim() === '';
};

/**
 * 쿠폰 코드가 유효한 형식인지 검증합니다.
 *
 * @param code - 검증할 쿠폰 코드
 * @returns 영문 대문자와 숫자만 포함되어 있으면 true
 */
export const isValidCouponCode = (code: string): boolean => {
  return /^[A-Z0-9]+$/.test(code);
};
