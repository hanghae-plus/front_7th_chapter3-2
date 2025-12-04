// 가격을 한국 원화 형식으로 포맷
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString('ko-KR')}`;
};

export const formatPriceWithWon = (price: number): string => {
  return `${price.toLocaleString('ko-KR')}원`;
};

// 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 소수를 퍼센트로 변환 (0.1 → 10%)
export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
