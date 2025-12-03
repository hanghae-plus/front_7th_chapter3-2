import { useState, useCallback } from "react";
import { ProductWithUI } from "./useProducts";

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

const initialFormState: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

interface UseProductFormProps {
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const useProductForm = ({
  addProduct,
  updateProduct,
}: UseProductFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setEditingProduct(null);
    setShowForm(false);
  }, []);

  const openNewForm = useCallback(() => {
    setEditingProduct("new");
    setFormData(initialFormState);
    setShowForm(true);
  }, []);

  const startEdit = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== "new") {
        updateProduct(editingProduct, formData);
      } else {
        addProduct(formData);
      }
      resetForm();
    },
    [editingProduct, formData, addProduct, updateProduct, resetForm]
  );

  return {
    // 상태
    showForm,
    editingProduct,
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

