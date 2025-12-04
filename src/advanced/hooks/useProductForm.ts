import { useState } from "react";
import { ProductForm, ProductWithUI } from "../types/types";

interface useProductFormProps {
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
}

export const useProductForm = ({
  addProduct,
  updateProduct,
}: useProductFormProps) => {
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null); // new / productId / null

  // 상품 추가 시작할 때
  const startNewProduct = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(true);
  };

  // 상품 수정 시작할 때
  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  // 생성 or 수정 후 상태 초기화
  const resetProductFormState = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
    } else {
      addProduct({
        ...productForm,
      });
    }

    resetProductFormState();
  };

  return {
    productForm,
    setProductForm,
    showProductForm,
    editingProduct,
    startNewProduct,
    startEditProduct,
    handleProductSubmit,
    resetProductFormState,
  };
};
