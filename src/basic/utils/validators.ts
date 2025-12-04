export const isValidCouponCode = (code: string): boolean => {
  return /^[A-Z0-9]{4,12}$/.test(code);
};

export const isValidStock = (stock: number): boolean => {
  return stock >= 0;
};

export const isValidPrice = (price: number): boolean => {
  return price > 0;
};
