/**
 * 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
 */
export function isValidCouponCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const regex = /^[A-Z0-9]{4,12}$/;
  return regex.test(code);
}

/**
 * 재고 수량 검증 (0 이상)
 */
export function isValidStock(stock: number): boolean {
  return typeof stock === 'number' && !isNaN(stock) && stock >= 0;
}

/**
 * 가격 검증 (양수)
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && !isNaN(price) && price > 0;
}

/**
 * 문자열에서 숫자만 추출
 */
export function extractNumbers(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value.replace(/[^0-9]/g, '');
}
