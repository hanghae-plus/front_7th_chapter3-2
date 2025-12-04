import { Discount, Product, ProductWithUI } from '../../types';

export const getMaxDiscountRate = (product: Product): number | undefined => {
  if (product.discounts.length === 0) return undefined;
  return Math.max(...product.discounts.map((d) => d.rate));
};

export const getMinDiscountQuantity = (
  product: Product
): number | undefined => {
  if (product.discounts.length === 0) return undefined;
  return Math.min(...product.discounts.map((d) => d.quantity));
};

export const isSoldOut = (remainingStock: number): boolean => {
  return remainingStock <= 0;
};

export const filterProductsBySearchTerm = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm) return products;

  const term = searchTerm.toLowerCase();
  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });
};

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
