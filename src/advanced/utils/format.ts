/**
 * 숫자를 통화 형식으로 포맷팅합니다.
 *
 * @param amount - 포맷팅할 금액
 * @param options - 포맷 옵션
 * @returns 포맷팅된 통화 문자열
 *
 * @example
 * formatCurrency(10000) // "10,000"
 * formatCurrency(10000, { prefix: '₩' }) // "₩10,000"
 * formatCurrency(10000, { suffix: '원' }) // "10,000원"
 */
export const formatCurrency = (
  amount: number,
  options?: {
    prefix?: string;
    suffix?: string;
    locale?: string;
  }
): string => {
  const formatted = amount.toLocaleString(options?.locale || 'ko-KR');
  return `${options?.prefix || ''}${formatted}${options?.suffix || ''}`;
};

/**
 * 상품 가격을 포맷팅합니다.
 * 품절 상태에 따라 'SOLD OUT' 또는 가격을 반환합니다.
 *
 * @param price - 상품 가격
 * @param options - 포맷 및 품절 체크 옵션
 * @returns 포맷팅된 가격 또는 품절 텍스트
 *
 * @example
 * formatPrice(10000, { suffix: '원' }) // "10,000원"
 * formatPrice(10000, { prefix: '₩' }) // "₩10,000"
 * formatPrice(10000, { isSoldOut: true }) // "SOLD OUT"
 * formatPrice(10000, { isSoldOut: true, soldOutText: '품절' }) // "품절"
 */
export const formatPrice = (
  price: number,
  options?: {
    isSoldOut?: boolean;
    soldOutText?: string;
    prefix?: string;
    suffix?: string;
    locale?: string;
  }
): string => {
  if (options?.isSoldOut) {
    return options.soldOutText || 'SOLD OUT';
  }

  return formatCurrency(price, {
    prefix: options?.prefix,
    suffix: options?.suffix,
    locale: options?.locale
  });
};
