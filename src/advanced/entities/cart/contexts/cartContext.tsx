import { createContext, type Dispatch, type SetStateAction, useContext } from 'react';
import { useCartStorage } from '../hooks/useCartStorage';
import { type CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useCartStorage([]);
  return <CartContext value={{ cart, setCart }}>{children}</CartContext>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
