import { useState } from "react";
import { CartItem } from "../../types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const addToCart = (cart: CartItem) => {
    setCart((prev) => {
      const updated = [...prev, cart];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const emptyCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  }

  return { cart, addToCart, removeFromCart, emptyCart };
};
