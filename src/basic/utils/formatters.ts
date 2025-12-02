export const formatPrice = (inStock: number, price: number, isWon: boolean = false): string => {
  if (inStock <= 0) return "SOLD_OUT";

  if (isWon) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
