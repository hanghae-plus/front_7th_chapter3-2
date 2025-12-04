import { CartItem, Product } from '../../types';
import { ProductWithUI } from '../types';

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
