export const formatPriceKRW = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};
