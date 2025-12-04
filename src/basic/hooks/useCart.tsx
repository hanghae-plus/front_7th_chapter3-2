import { useCallback, useEffect, useState } from "react";
import { CartItem, Coupon, Product, ProductWithUI } from "../../types";
import { useLocalStorage } from "./useLocalStorage";
import {
  calculateItemTotal as calcItemTotal,
  calculateCartTotal as calcCartTotal,
  updateCartItemQuantity,
} from "../utils/cartCalculations";
import { getRemainingStock as calcRemainingStock } from "../utils/productCalculations";

type Props = {
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export const useCart = ({ addNotification }: Props) => {
  const [totalItemCount, setTotalItemCount] = useState(0);

  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const calculateItemTotal = (item: CartItem): number => {
    return calcItemTotal(item, cart);
  };

  const calculateCartTotal = (selectedCoupon: Coupon | null) => {
    return calcCartTotal(cart, selectedCoupon);
  };

  const getRemainingStock = (product: Product): number => {
    return calcRemainingStock(product, cart);
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = calcRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
            return prevCart;
          }

          return prevCart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (products: Product[], productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }
      setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity));
    },
    [addNotification]
  );

  const completeOrder = useCallback(
    (onSuccess?: () => void) => {
      const orderNumber = `ORD-${Date.now()}`;
      addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
      setCart([]);
      if (onSuccess) {
        onSuccess();
      }
    },
    [addNotification, setCart]
  );

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return {
    cart,
    totalItemCount,
    addToCart,
    setCart,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
    updateQuantity,
    removeFromCart,
    completeOrder,
  };
};
