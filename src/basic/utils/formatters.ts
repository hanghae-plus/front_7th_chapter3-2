// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷

// TODO: 구현

export const formatPriceKor = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

export const formatPriceUnit = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

export const formatDiscount = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
