// Shared (Store)
import { useCartStore } from "./cartStore";
import { useProductStore } from "../../product/model/productStore";

/**
 * 장바구니 관련 상태와 액션을 관리하는 커스텀 훅
 * 내부적으로 ProductStore를 구독하여 재고 확인에 필요한 데이터를 자동으로 확보합니다.
 */
export const useCart = () => {
  const cartStore = useCartStore();
  const products = useProductStore((state) => state.products);

  return {
    cart: cartStore.cart,
    selectedCoupon: cartStore.selectedCoupon,
    
    // 단순 전달 액션
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    applyCoupon: cartStore.applyCoupon,
    setSelectedCoupon: cartStore.setSelectedCoupon,
    completeOrder: cartStore.completeOrder,
    
    // 복합 액션 (Dependency Injection)
    updateQuantity: (productId: string, newQuantity: number) => 
      cartStore.updateQuantity(productId, newQuantity, products)
  };
};