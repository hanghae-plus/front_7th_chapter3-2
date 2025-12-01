import { useState } from "react";
import { CartItem } from "../../types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  return { cart, setCart };
};
