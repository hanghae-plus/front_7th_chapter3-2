import { useAtom } from "jotai";
import { Coupon, ProductWithUI } from "../../types";
import {
  addItemToCart,
  calculateCartTotal,
  getRemainingStock,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";
import { cartAtom, selectedCouponAtom } from "../stores/atoms";
import { useAddNotification } from "./useNotification";

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const addNotification = useAddNotification();

  const addToCart = (product: ProductWithUI) => {
    if (getStock(product) <= 0) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    // 먼저 재고 체크
    const currentItem = cart.find((item) => item.product.id === product.id);
    const currentQty = currentItem?.quantity || 0;

    if (currentQty >= product.stock) {
      addNotification(`재고는 ${product.stock}개까지만 있습니다`, "error");
      return;
    }

    setCart((prev) => addItemToCart(prev, product));
    addNotification("장바구니에 담았습니다", "success");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => removeItemFromCart(prev, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item && newQuantity > item.product.stock) {
        addNotification(
          `재고는 ${item.product.stock}개까지만 있습니다`,
          "error"
        );
      }
      return updateCartItemQuantity(prev, productId, newQuantity);
    });
  };

  const emptyCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    if (!coupon) {
      setSelectedCoupon(null);
      return;
    }

    const { totalAfterDiscount } = calculateTotal();

    if (totalAfterDiscount < 10000 && coupon.discountType === "percentage") {
      addNotification(
        "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        "warning"
      );
      return;
    }
    setSelectedCoupon(coupon);
    addNotification("쿠폰이 적용되었습니다", "success");
  };

  const getStock = (product: ProductWithUI) => {
    return getRemainingStock(cart, product);
  };

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
    getStock,
    applyCoupon,
    calculateTotal,
  };
};
