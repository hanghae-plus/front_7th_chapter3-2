import { useState } from "react";
import { ProductWithUI } from "../../../../types";

interface UseProductFormProps {
  onAdd: (product: Omit<ProductWithUI, "id">) => void;
  onUpdate: (id: string, product: Partial<ProductWithUI>) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const useProductForm = ({
  onAdd,
  onUpdate,
  addNotification,
}: UseProductFormProps) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      if (value === "" || /^\d+$/.test(value)) {
        updateFormField(
          name as "price" | "stock",
          value === "" ? 0 : parseInt(value)
        );
      }
      return;
    }
    updateFormField(name as "name" | "description", value);
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      updateFormField("price", 0);
    } else if (parseInt(value) < 0) {
      addNotification("가격은 0보다 커야 합니다", "error");
      updateFormField("price", 0);
    }
  };

  const handleStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      updateFormField("stock", 0);
    } else if (parseInt(value) < 0) {
      addNotification("재고는 0보다 커야 합니다", "error");
      updateFormField("stock", 0);
    } else if (parseInt(value) > 9999) {
      addNotification("재고는 9999개를 초과할 수 없습니다", "error");
      updateFormField("stock", 9999);
    }
  };

  const handleDiscountChange = (
    index: number,
    field: "quantity" | "rate",
    value: number
  ) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index][field] = value;
    updateFormField("discounts", newDiscounts);
  };

  const handleRemoveDiscount = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    updateFormField("discounts", newDiscounts);
  };

  const handleAddDiscount = () => {
    const newDiscounts = [
      ...productForm.discounts,
      { quantity: 10, rate: 0.1 },
    ];
    updateFormField("discounts", newDiscounts);
  };

  return {
    productForm,
    editingProduct, // UI에서 "수정" vs "추가" 타이틀 표시 등을 위해 필요
    startEditProduct,
    startAddProduct,
    handleSubmit,
    resetForm,
    updateFormField,
    handleChange,
    handlePriceBlur,
    handleStockBlur,
    handleDiscountChange,
    handleRemoveDiscount,
    handleAddDiscount,
  };
};
