import { useState, useCallback } from "react";
import { ProductWithUI } from "../store/useProductStore";
import { useProductStore } from "../store/useProductStore";
import { useNotificationStore } from "../store/useNotificationStore";

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export type FormMode = "create" | "edit";

const initialFormState: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export const useProductForm = () => {
  // Store에서 액션 가져오기
  const { addProduct, updateProduct } = useProductStore();
  const { addNotification } = useNotificationStore();

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<FormMode>("create");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setEditingProductId(null);
    setMode("create");
    setShowForm(false);
  }, []);

  const openNewForm = useCallback(() => {
    setMode("create");
    setEditingProductId(null);
    setFormData(initialFormState);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (product: ProductWithUI) => {
      setMode("edit");
      setEditingProductId(product.id);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || "",
        discounts: product.discounts || [],
      });
      setShowForm(true);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (mode === "edit" && editingProductId) {
        updateProduct(editingProductId, formData);
        addNotification("상품이 수정되었습니다.", "success");
      } else {
        addProduct(formData);
        addNotification("상품이 추가되었습니다.", "success");
      }
      resetForm();
    },
    [mode, editingProductId, formData, addProduct, updateProduct, resetForm, addNotification]
  );

  return {
    // 상태
    showForm,
    mode,
    formData,
    // setter
    setFormData,
    // 액션
    openNewForm,
    startEdit,
    handleSubmit,
    resetForm,
  };
};

export type ProductFormState = ReturnType<typeof useProductForm>;

