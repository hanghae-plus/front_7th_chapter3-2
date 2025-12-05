// 가격을 한국 원화 형식으로 포맷
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}`;
}

// 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 소수를 퍼센트로 변환 (0.1 → 10%)
export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
}