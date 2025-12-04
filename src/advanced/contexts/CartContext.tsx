import { createContext, useContext, ReactNode } from "react";
import { useCart } from "../hooks/useCart";
import { useNotificationContext } from "./NotificationContext";

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotificationContext();
  const cartState = useCart(addNotification);

  return <CartContext.Provider value={cartState}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};
