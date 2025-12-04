import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../../types";
import { useAtom } from "jotai";

const atomCart = atomWithStorage<CartItem[]>("cart", []);

export const useCart = () => {
  const [cart, setCart] = useAtom(atomCart);

  return { cart, setCart };
};
