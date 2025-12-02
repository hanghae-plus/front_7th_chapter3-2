import { useEffect, useState } from "react";
import { CartItem, ProductWithUI } from "../../types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // localStorage 변경 감지 (다른 컴포넌트에서 변경 시)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("cart");
      setCart(saved ? JSON.parse(saved) : []);
    };

    // 커스텀 이벤트 리스너
    window.addEventListener("cart-updated", handleStorageChange);

    return () => {
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, []);

  const addToCart = (product: ProductWithUI) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);

      if (existingItem) {
        // 이미 장바구니에 있는 경우 수량 증가
        const newQuantity = existingItem.quantity + 1;

        // 재고 확인
        if (newQuantity > product.stock) {
          alert(`재고는 ${product.stock}개까지만 있습니다.`);
          return prev;
        }

        const updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cart-updated")); // 이벤트 발생
        return updated;
      }

      // 새로운 상품 추가
      const updated = [...prev, { product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated")); // 이벤트 발생
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated")); // 이벤트 발생
      return updated;
    });
  };

  const emptyCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated")); // 이벤트 발생
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated")); // 이벤트 발생
      return updated;
    });
  };

  return { cart, addToCart, removeFromCart, updateQuantity, emptyCart };
};
