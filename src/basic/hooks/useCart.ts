import { useEffect, useState } from "react";
import { CartItem, ProductWithUI } from "../../types";
import {
  addItemToCart,
  getRemainingStock,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // cart 변경 시 localStorage 자동 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductWithUI) => {
    setCart((prev) => {
      const newCart = addItemToCart(prev, product);

      if (newCart === prev) {
        alert(`재고는 ${product.stock}개까지만 있습니다.`);
      }

      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => removeItemFromCart(prev, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) => updateCartItemQuantity(prev, productId, newQuantity));
  };

  const emptyCart = () => {
    setCart([]);
  };

  const getStock = (product: ProductWithUI) => {
    return getRemainingStock(cart, product);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
    getStock,
  };
};
