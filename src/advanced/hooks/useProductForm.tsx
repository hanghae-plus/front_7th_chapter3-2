import { useCallback, useState } from "react";
import { ProductWithUI } from "../../types";
import { validateProductPrice, validateProductStock, isNumericInput } from "../utils/validators";
import { useNotificationStore } from "../store/notificationStore";

type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

type Props = {
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
};

export const useProductForm = ({ addProduct, updateProduct }: Props) => {
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });

  const resetForm = useCallback(() => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  }, []);

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
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct("new");
    setShowProductForm(true);
  }, []);

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
    [editingProduct, productForm, addProduct, updateProduct, resetForm]
  );

  const handlePriceChange = useCallback((value: string) => {
    if (isNumericInput(value)) {
      setProductForm((prev) => ({ ...prev, price: value === "" ? 0 : parseInt(value) }));
    }
  }, []);

  const handlePriceBlur = useCallback(
    (value: string) => {
      if (value === "") {
        setProductForm((prev) => ({ ...prev, price: 0 }));
      } else {
        const numValue = parseInt(value);
        const result = validateProductPrice(numValue);
        if (!result.isValid && result.correctedValue !== undefined) {
          if (result.errorMessage) {
            addNotification(result.errorMessage, "error");
          }
          setProductForm((prev) => ({ ...prev, price: result.correctedValue! }));
        }
      }
    },
    [addNotification]
  );

  const handleStockChange = useCallback((value: string) => {
    if (isNumericInput(value)) {
      setProductForm((prev) => ({ ...prev, stock: value === "" ? 0 : parseInt(value) }));
    }
  }, []);

  const handleStockBlur = useCallback(
    (value: string) => {
      if (value === "") {
        setProductForm((prev) => ({ ...prev, stock: 0 }));
      } else {
        const numValue = parseInt(value);
        const result = validateProductStock(numValue);
        if (!result.isValid && result.correctedValue !== undefined) {
          if (result.errorMessage) {
            addNotification(result.errorMessage, "error");
          }
          setProductForm((prev) => ({ ...prev, stock: result.correctedValue! }));
        }
      }
    },
    [addNotification]
  );

  return {
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    startEditProduct,
    startAddProduct,
    handleProductSubmit,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
    resetForm,
  };
};
