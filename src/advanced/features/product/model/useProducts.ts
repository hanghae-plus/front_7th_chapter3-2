import { useProductStore } from "./productStore";

/**
 * 상품 관련 상태와 액션을 제공하는 커스텀 훅
 * (Zustand Store를 컴포넌트에서 쉽게 쓰도록 연결하는 Selector 역할)
 */
export const useProducts = () => {
  // 스토어 전체를 반환하거나, 필요한 것만 골라서 반환
  const productStore = useProductStore();
  
  return {
    products: productStore.products,
    addProduct: productStore.addProduct,
    updateProduct: productStore.updateProduct,
    deleteProduct: productStore.deleteProduct,
  };
};