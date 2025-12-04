import { useState, useCallback } from "react";
import { useProducts } from "../contexts/ProductsContext";
import { ProductWithUI } from "../types/ProductWithUI";
import { addNotification } from "../../notifications/utils/addNotification";

type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

const initialFormData: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export function useProductForm() {
  const products = useProducts();
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] =
    useState<ProductFormData>(initialFormData);
  const [showProductForm, setShowProductForm] = useState(false);

  const resetForm = useCallback(() => {
    setProductForm(initialFormData);
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };

      products.addItem(product);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [products]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      products.getById(productId)?.update(updates);
      addNotification("상품이 수정되었습니다.", "success");
    },
    [products]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      products.getById(productId)?.delete();
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [products]
  );

  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== "new") {
        updateProduct(editingProduct, productForm);
      } else {
        addProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
      }
      resetForm();
    },
    [editingProduct, productForm, updateProduct, addProduct, resetForm]
  );

  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  }, []);

  const startAddProduct = useCallback(() => {
    setEditingProduct("new");
    setProductForm(initialFormData);
    setShowProductForm(true);
  }, []);

  const handleFormCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const updateForm = useCallback((updates: Partial<ProductFormData>) => {
    setProductForm((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    editingProduct,
    productForm,
    showProductForm,
    updateForm,
    handleProductSubmit,
    startEditProduct,
    startAddProduct,
    handleFormCancel,
    deleteProduct,
  };
}

