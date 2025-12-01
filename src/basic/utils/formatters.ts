// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현

export const formatPrice = (price: number | string) => {
  return Number(price).toLocaleString();
};
export const formatDate = (date: Date) => {
  if (!(date instanceof Date)) return null; // 유효성 검사
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
export const formatPercentage = (rate: number) => {
  return `${Number(rate) * 100}%`;
};
