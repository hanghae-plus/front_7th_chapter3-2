import { useState, useCallback } from "react";
import { ProductWithUI } from "../../../lib/constants";
import { ProductFormData } from "../schemas/productSchemas";

export function useProductManagement(
  products: ProductWithUI[],
  setProducts: (products: ProductWithUI[]) => void,
  onNotify: (message: string, type: "error" | "success") => void
) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const addProduct = useCallback(
    (data: ProductFormData) => {
      const newProduct: ProductWithUI = {
        ...data,
        id: `p${Date.now()}`,
      };
      setProducts([...products, newProduct]);
      onNotify("상품이 추가되었습니다.", "success");
      setShowProductForm(false);
      setEditingProduct(null);
    },
    [products, setProducts, onNotify]
  );

  const updateProduct = useCallback(
    (productId: string, data: ProductFormData) => {
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, ...data } : product
        )
      );
      onNotify("상품이 수정되었습니다.", "success");
      setShowProductForm(false);
      setEditingProduct(null);
    },
    [products, setProducts, onNotify]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(products.filter((p) => p.id !== productId));
      onNotify("상품이 삭제되었습니다.", "success");
    },
    [products, setProducts, onNotify]
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
