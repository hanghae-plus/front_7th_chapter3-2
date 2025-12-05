/**
 * 가격을 한국 원화 형식으로 포맷
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`;
}

/**
 * 가격을 원화 기호와 함께 포맷 (₩ 기호 포함)
 */
export function formatPriceWithSymbol(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export function formatDate(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 소수를 퍼센트로 변환 (0.1 → 10%)
 */
export function formatPercentage(rate: number): string {
  if (typeof rate !== 'number' || isNaN(rate)) {
    return '0%';
  }

  return `${Math.round(rate * 100)}%`;
}

/**
 * 할인율을 퍼센트 형식으로 포맷팅
 * @alias formatPercentage
 */
export const formatDiscount = formatPercentage;

/**
 * 숫자를 천단위 구분자로 포맷팅
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * 통화 포맷팅 (범용)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'KRW',
  locale: string = 'ko-KR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
