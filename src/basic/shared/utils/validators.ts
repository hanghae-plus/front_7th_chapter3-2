export const isValidCouponCode = (code: string) => {
  return /^[A-Z0-9]{4,12}$/.test(code);
};
export const isValidStock = (stock: number) => {
  return stock > 0;
};
export const isValidPrice = (price: number) => {
  return price >= 0;
};
export const extractNumbers = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};
export const isNumericString = (value: string) => {
  return value === extractNumbers(value);
};
