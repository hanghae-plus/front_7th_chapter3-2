export const calculateDiscountRate = (
  itemTotal: number,
  originalPrice: number
): number => {
  if (itemTotal >= originalPrice) return 0;
  return Math.round((1 - itemTotal / originalPrice) * 100);
};

export const hasDiscount = (
  itemTotal: number,
  originalPrice: number
): boolean => {
  return itemTotal < originalPrice;
};
