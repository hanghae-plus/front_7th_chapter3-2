/**
 * 가격을 한국 원화 형식으로 포맷팅합니다.
 */
export function formatPrice(price: number): string {
  return `₩${price.toLocaleString()}`;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 소수를 퍼센트 문자열로 변환합니다.
 * @example formatPercentage(0.1) // "10%"
 */
export function formatPercentage(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
