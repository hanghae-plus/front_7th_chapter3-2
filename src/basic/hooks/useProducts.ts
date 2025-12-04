import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants";
import { Notification } from "../models/notificiation";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useProducts = (
  addNotification: (message: string, type: Notification["type"]) => void
) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
    addNotification("상품이 추가되었습니다", "success");
  };

  const updateProduct = (updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updates.id ? { ...product, ...updates } : product
      )
    );
    addNotification("상품이 수정되었습니다", "success");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addNotification("상품이 삭제되었습니다", "success");
  };

  return { products, addProduct, updateProduct, deleteProduct };
};
