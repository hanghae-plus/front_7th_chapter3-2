import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { cartAtom, totalItemCountAtom } from "../store/atoms/cartAtom";
import { productsAtom } from "../store/atoms/productsAtom";
import { getRemainingStock } from "../models/cart";
import { ProductWithUI, MESSAGES } from "../constants";
import { useNotification } from "./useNotification";

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const products = useAtomValue(productsAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const { addNotification } = useNotification();

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      let notificationMessage = "";
      let notificationType: "error" | "success" = "success";

      setCart((prevCart) => {
        const remainingStock = getRemainingStock(product, prevCart);
        if (remainingStock <= 0) {
          notificationMessage = MESSAGES.OUT_OF_STOCK;
          notificationType = "error";
          return prevCart;
        }

        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          if (newQuantity > product.stock) {
            notificationMessage = MESSAGES.STOCK_LIMIT_EXCEEDED(product.stock);
            notificationType = "error";
            return prevCart;
          }
          notificationMessage = MESSAGES.CART_ITEM_ADDED;
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        notificationMessage = MESSAGES.CART_ITEM_ADDED;
        return [...prevCart, { product, quantity: 1 }];
      });

      if (notificationMessage) {
        addNotification(notificationMessage, notificationType);
      }
    },
    [setCart, addNotification]
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
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (newQuantity > product.stock) {
        addNotification(MESSAGES.STOCK_LIMIT_EXCEEDED(product.stock), "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification, setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
