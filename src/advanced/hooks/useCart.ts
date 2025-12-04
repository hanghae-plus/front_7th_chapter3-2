import { CartItem } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  return { cart, setCart };
};
