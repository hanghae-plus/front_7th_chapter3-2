import { Product } from "../../types";

export const formatPrice = (price: number, isAdmin: boolean, getRemainingStock: (product: Product) => number, product?: Product): string => {
  if (product && getRemainingStock(product) <= 0) {
    return 'SOLD OUT';
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  
  return `₩${price.toLocaleString()}`;
};
