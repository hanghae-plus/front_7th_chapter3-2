export const isValidStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0;
};

export const isValidPrice = (price: number): boolean => {
  return !Number.isNaN(price) && price > 0;
};
