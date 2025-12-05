import { useCallback, useEffect, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import cartModel from "../models/cart";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const useCart = () => {
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
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: ProductWithUI) => {
    setCart((prevCart) => cartModel.addItemToCart(prevCart, product));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) => cartModel.updateItemQuantity(prevCart, productId, newQuantity));
  }, []);

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  const calculateTotal = useCallback(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useCallback(
    (product: Product) => {
      return cartModel.getRemainingStock(cart, product);
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    data: cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
  };
};

export default useCart;
