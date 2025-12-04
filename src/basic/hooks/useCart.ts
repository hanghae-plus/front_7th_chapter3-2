import { useCallback } from "react";
import { CartItem, Product } from "../types";
import { calculateRemainingStock } from "../models/calculateRemainingStock";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCart = ({
  onSuccess,
  onError,
}: {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = calculateRemainingStock(product, cart);
      if (remainingStock <= 0) {
        onError("재고가 부족합니다!");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            onError(`재고는 ${product.stock}개까지만 있습니다.`);
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      onSuccess("장바구니에 담았습니다");
    },
    [cart, onError, onSuccess, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (product: Product, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(product.id);
        return;
      }

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        onError(`재고는 ${maxStock}개까지만 있습니다.`);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [removeFromCart, onError, setCart]
  );

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
