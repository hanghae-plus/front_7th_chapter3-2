import { useState } from "react";
import { ProductWithUI } from "../../../../types";

interface UseProductFormProps {
  onAdd: (product: Omit<ProductWithUI, "id">) => void;
  onUpdate: (id: string, product: Partial<ProductWithUI>) => void;
}

export const useProductForm = ({ onAdd, onUpdate }: UseProductFormProps) => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
  };

  const startAddProduct = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      onUpdate(editingProduct, productForm);
    } else {
      onAdd({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    resetForm();
  };

  const updateFormField = <K extends keyof typeof productForm>(
    key: K,
    value: (typeof productForm)[K]
  ) => {
    setProductForm((prev) => ({ ...prev, [key]: value }));
  };

  return {
    formState: productForm,
    editingProduct, // UI에서 "수정" vs "추가" 타이틀 표시 등을 위해 필요
    handlers: {
      startEditProduct,
      startAddProduct,
      handleSubmit,
      resetForm,
      updateFormField,
    },
  };
};
