import { useState, useCallback } from "react";
import { ProductWithUI } from "../../../lib/constants";
import { ProductFormData } from "../schemas/productSchemas";
import { useStore } from "../../../shared/stores/store";

export function useProductManagement() {
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);
  const addNotification = useStore((state) => state.addNotification);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const addProduct = useCallback(
    (data: ProductFormData) => {
      const newProduct: ProductWithUI = {
        ...data,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, newProduct]);
      addNotification("상품이 추가되었습니다.", "success");
      setShowProductForm(false);
      setEditingProduct(null);
    },
    [setProducts, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, data: ProductFormData) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...data } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
      setShowProductForm(false);
      setEditingProduct(null);
    },
    [setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [setProducts, addNotification]
  );

  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setShowProductForm(true);
  }, []);

  const startNewProduct = useCallback(() => {
    setEditingProduct("new");
    setShowProductForm(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  const getEditingProductData = useCallback((): ProductWithUI | null => {
    if (!editingProduct || editingProduct === "new") return null;
    return products.find((p) => p.id === editingProduct) || null;
  }, [editingProduct, products]);

  const handleSubmit = useCallback(
    (data: ProductFormData) => {
      if (editingProduct && editingProduct !== "new") {
        updateProduct(editingProduct, data);
      } else {
        addProduct(data);
      }
    },
    [editingProduct, updateProduct, addProduct]
  );

  return {
    editingProduct,
    showProductForm,
    addProduct,
    updateProduct,
    deleteProduct,
    startEditProduct,
    startNewProduct,
    cancelEdit,
    getEditingProductData,
    handleSubmit,
  };
}
