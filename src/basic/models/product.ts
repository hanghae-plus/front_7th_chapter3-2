import { Discount, ProductWithUI } from '../../types';

export const addProduct = (
  product: ProductWithUI,
  products: ProductWithUI[]
) => {
  return [...products, product];
};

export const updateProduct = (
  updates: Partial<ProductWithUI>,
  products: ProductWithUI[]
) => {
  return products.map((p) => (p.id === updates.id ? { ...p, ...updates } : p));
};

export const updateProductStock = (
  product: ProductWithUI,
  products: ProductWithUI[]
) => {
  return products.map((p) =>
    p.id === product.id ? { ...p, stock: product.stock } : p
  );
};

export const removeProduct = (productId: string, products: ProductWithUI[]) => {
  return products.filter((p) => p.id !== productId);
};

export const updateDiscountForProduct = (
  discount: Discount,
  product: ProductWithUI
) => {
  return { ...product, discounts: [...product.discounts, discount] };
};
