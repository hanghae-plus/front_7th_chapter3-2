import { Discount, Product } from '@/features/product';

export const generateProductId = (): string => {
  return `p${Date.now()}`;
};

export const findProductById = (products: Product[], productId: string) => {
  return products.find((item) => item.id === productId);
};

export const addProductToList = (
  products: Product[],
  product: Omit<Product, 'id'>
): Product[] => {
  return [...products, { ...product, id: generateProductId() }];
};

export const updateProductInList = (
  products: Product[],
  product: Partial<Product>
): Product[] => {
  return products.map((item) =>
    item.id === product.id ? { ...item, ...product } : item
  );
};

export const removeProductInList = (
  products: Product[],
  productId: string
): Product[] => {
  return products.filter((item) => item.id !== productId);
};

export const updateStockInList = (
  products: Product[],
  productId: string,
  stock: number
): Product[] => {
  return products.map((item) =>
    item.id === productId ? { ...item, stock } : item
  );
};

export const addDiscountToList = (
  products: Product[],
  productId: string,
  discount: Discount
): Product[] => {
  return products.map((item) =>
    item.id === productId
      ? { ...item, discounts: [...item.discounts, discount] }
      : item
  );
};

export const removeDiscountFromList = (
  products: Product[],
  productId: string,
  discount: Discount
): Product[] => {
  return products.map((item) =>
    item.id === productId
      ? {
          ...item,
          discounts: item.discounts.filter(
            ({ quantity, rate }) =>
              !(discount.quantity === quantity && discount.rate === rate)
          ),
        }
      : item
  );
};
