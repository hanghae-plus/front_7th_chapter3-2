import { useCallback, useState } from "react";
import { CartItem } from "../models/cart";
import { Coupon } from "../models/coupon";
import { Product, ProductWithUI } from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import * as cartModel from "../models/cart";

export function useCart(callback?: (message: string, type: "error" | "success" | "warning") => void) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = cartModel.calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        callback?.("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.", "error");
        return;
      }

      setSelectedCoupon(coupon);
      callback?.("쿠폰이 적용되었습니다.", "success");
    },
    [cartModel.calculateCartTotal]
  );

  const calculateCartTotal = () => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  };

  const getRemainingStock = (product: Product) => {
    return cartModel.getRemainingStock(product, cart);
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = cartModel.getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        callback?.("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            callback?.(`재고는 ${product.stock}개까지만 있습니다.`, "error");
            return prevCart;
          }

          return cartModel.updateCartItemQuantity(prevCart, product.id, newQuantity);
        }

        return cartModel.addItemToCart(prevCart, product);
      });

      callback?.("장바구니에 담았습니다", "success");
    },
    [cart, cartModel.getRemainingStock]
  );

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
  };

  const updateQuantity = useCallback(
    (product: ProductWithUI, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(product.id);
        return;
      }

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        callback?.(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) => cartModel.updateCartItemQuantity(prevCart, product.id, newQuantity));
    },
    [removeFromCart, cartModel.getRemainingStock]
  );

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    applyCoupon,
    calculateCartTotal,
    getRemainingStock,
    updateQuantity,
    clearCart,
  };
}
