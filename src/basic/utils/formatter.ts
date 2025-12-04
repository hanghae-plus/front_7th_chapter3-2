// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현

const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const formatPercentage = (rate: number): string => {
  return `${Math.round(rate)}%`;
};

export default { formatPrice, formatDate, formatPercentage };
