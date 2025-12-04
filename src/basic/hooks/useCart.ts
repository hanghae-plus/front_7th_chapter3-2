import { useCallback, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "../../types";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const useCart = (addNotification: (message: string, type: "error" | "success" | "warning") => void) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
      addNotification("장바구니에 담았습니다", "success");
    },
    [addNotification]
  );

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return { data: cart, addToCart, removeFromCart, clearCart, updateQuantity, totalItemCount };
};

export default useCart;
