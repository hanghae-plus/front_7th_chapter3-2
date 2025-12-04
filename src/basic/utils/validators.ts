/**
 * 쿠폰 코드 형식을 검증합니다.
 * 4-12자의 영문 대문자와 숫자만 허용됩니다.
 */
export function isValidCouponCode(code: string): boolean {
  return /^[A-Z0-9]{4,12}$/.test(code);
}

/**
 * 재고 수량이 유효한지 검증합니다.
 * 0 이상의 정수여야 합니다.
 */
export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= 0;
}

/**
 * 가격이 유효한지 검증합니다.
 * 양수여야 합니다.
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price > 0;
}

/**
 * 문자열에서 숫자만 추출합니다.
 */
export function extractNumbers(value: string): string {
  return value.replace(/\D/g, '');
}
