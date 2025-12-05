import { createContext, type Dispatch, type SetStateAction, useContext, useMemo } from 'react';
import { useCartStorage } from '../entities/cart/hooks/useCartStorage';
import { type CartItem } from '../entities/cart/types';

interface CartContextType {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useCartStorage([]);

  const value = useMemo(() => ({ cart, setCart }), [cart, setCart]);

  return <CartContext value={value}>{children}</CartContext>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
