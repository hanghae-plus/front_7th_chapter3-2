import { Discount } from "../../types";

export const NEW_DISCOUNT: Discount = { quantity: 10, rate: 0.1 };

export const addDiscount = (discounts: Discount[]): Discount[] => {
  return [...discounts, NEW_DISCOUNT];
};

export const removeDiscount = (
  discounts: Discount[],
  index: number
): Discount[] => {
  return discounts.filter((_, i) => i !== index);
};

export const updateDiscount = (
  discounts: Discount[],
  index: number,
  updates: Partial<Discount>
): Discount[] => {
  return discounts.map((discount, i) =>
    i === index ? { ...discount, ...updates } : discount
  );
};

export const getDiscountRatePercent = (rate: number): number => {
  return Math.round(rate * 100);
};
