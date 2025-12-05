import { Discount, Product, ProductWithUI } from './types';
import { CartItem } from '../cart/types';
import { generateId } from '../../utils/id-generator';

// GET REMAINING STOCK
export const getRemainingStock = (product: Product, cartItems: CartItem[]): number => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

// FILTER PRODUCTS
export const filterProducts = (
  products: ProductWithUI[],
  debouncedSearchTerm: string
): ProductWithUI[] => {
  if (!debouncedSearchTerm) return products;
  return products.filter(product => {
    const name = product.name.toLowerCase();
    const description = product.description?.toLowerCase() || '';
    return (
      name.includes(debouncedSearchTerm.toLowerCase()) ||
      description.includes(debouncedSearchTerm.toLowerCase())
    );
  });
};

// ADD PRODUCT
export const getNewProducts = (
  products: ProductWithUI[],
  newProduct: Omit<ProductWithUI, 'id'>,
  idGenerator: () => string = () => generateId('product')
): ProductWithUI[] => [...products, { ...newProduct, id: idGenerator() }];

// UPDATE PRODUCT
export const getUpdatedProducts = (
  products: ProductWithUI[],
  productId: string,
  updates: Partial<ProductWithUI>
): ProductWithUI[] =>
  products.map(product => (product.id === productId ? { ...product, ...updates } : product));

// DELETE PRODUCT
export const getDeletedProducts = (products: ProductWithUI[], productId: string): ProductWithUI[] =>
  products.filter(product => product.id !== productId);

// DISCOUNT FORM
export const getDeletedDiscounts = (discounts: Discount[], index: number): Discount[] =>
  discounts.filter((_, i) => i !== index);

// SHOW
export const showSoldOutWarningMessage = (remainingStock: number): boolean => {
  return remainingStock <= 5 && remainingStock > 0;
};

export const showInStockMessage = (remainingStock: number): boolean => {
  return remainingStock > 5;
};
