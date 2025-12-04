export const formatPriceSymbol = (price: number) => {
  return `₩${price.toLocaleString()}`;
};

export const formatProceAdmin = (price: number) => {
  return `${price.toLocaleString()}원`;
};

// 소수를 퍼센트로 변환 (0.1 → 10%)
export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

export const formatMaxPercentage = (rates: number[]): string => {
  return `${Math.max(...rates) * 100}%`;
};
