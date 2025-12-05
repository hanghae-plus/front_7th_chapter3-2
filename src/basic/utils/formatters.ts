/**
 * 가격을 통화 형식으로 포맷팅 (₩ 기호)
 */
export const formatCurrency = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 가격을 원화 형식으로 포맷팅 (원 단위)
 */
export const formatCurrencyKRW = (price: number): string => {
  return `${price.toLocaleString()}원`;
};
