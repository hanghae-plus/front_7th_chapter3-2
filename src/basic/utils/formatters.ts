/**
 * 숫자를 통화 형식의 문자열로 변환
 * @param price - 변환할 숫자
 * @param options - 포맷팅 옵션
 * @param options.currency - 'KRW'는 '₩' 기호를, 'WON'은 '원'을 사용합니다.
 */
export const formatPrice = (price: number, options: { currency?: 'KRW' | 'WON' } = {}): string => {
  const { currency = 'KRW' } = options;

  if (currency === 'WON') {
    return `${price.toLocaleString()}원`;
  }
  
  return `₩${price.toLocaleString()}`;
};
