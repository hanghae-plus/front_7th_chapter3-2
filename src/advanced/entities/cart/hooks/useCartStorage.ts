import { CartItem } from '../../../../types';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';

export const useCartStorage = (initialCart: CartItem[]) => {
  return useLocalStorageState<CartItem[]>('cart', initialCart);
};
