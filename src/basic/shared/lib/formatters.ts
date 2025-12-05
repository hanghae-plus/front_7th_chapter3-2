// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷이 필요한 이유를 모르겠음.

export const formatPrice = (price: number): string => {
  if (isNaN(price)) return '0원';
  return price.toLocaleString('ko-KR');
};

export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
