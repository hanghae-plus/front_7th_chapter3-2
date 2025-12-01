import { useState } from "react";
import { CartItem } from "../../types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  return { cart, setCart };
};
