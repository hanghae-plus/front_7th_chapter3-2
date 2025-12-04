import { useState, type FC } from "react";
import ProductListTable from "../../components/adminPage/ProductListTable";
import ProductForm from "../../components/adminPage/ProductForm";
import { useProducts } from "../../hooks/useProducts";
import { ProductWithUI } from "../../../types";
import Section from "../../components/_common/Section";
import Button from "../../components/_common/Button";
import { useForm } from "../../utils/hooks/useForm";
import { validateStock, validatePrice } from "../../models/validation";
import { useAddNotification } from "../../hooks/useNotification";

const INITIAL_PRODUCT_FORM: Omit<ProductWithUI, "id"> = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

const ProductManagement: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const addNotification = useAddNotification();
  const {
    values: productForm,
    handleChange,
    resetForm,
    setValues: setProductForm,
  } = useForm<Omit<ProductWithUI, "id">>(INITIAL_PRODUCT_FORM);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const handleAddNew = () => {
    resetForm();
    setEditingProductId(null);
    setShowForm(true);
  };

  const handleEditStart = (product: ProductWithUI) => {
    const { id, ...formData } = product;
    setProductForm(formData);
    setEditingProductId(id);
    setShowForm(true);
  };

  const saveProduct = () => {
    if (editingProductId) {
      updateProduct({ ...productForm, id: editingProductId });
    } else {
      addProduct(productForm);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProduct();
    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  const handleNameChange = (value: string) => handleChange("name", value);
  const handleDescriptionChange = (value: string) =>
    handleChange("description", value);
  const handlePriceChange = (value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    const numValue = value === "" ? 0 : parseInt(value);
    const error = validatePrice(numValue);

    if (error) {
      addNotification(error, "error");
      return;
    }

    handleChange("price", numValue);
  };
  const handleStockChange = (value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    const numValue = value === "" ? 0 : parseInt(value);
    const error = validateStock(numValue);

    if (error) {
      addNotification(error, "error");
      return;
    }

    handleChange("stock", numValue);
  };
  const handleDiscountsChange = (value: any) =>
    handleChange("discounts", value);

  return (
    <Section
      title="상품 목록"
      action={
        <Button
          variant="solid"
          color="secondary"
          size="sm"
          onClick={handleAddNew}>
          새 상품 추가
        </Button>
      }>
      <ProductListTable
        products={products}
        onEdit={handleEditStart}
        onDelete={deleteProduct}
      />

      {showForm && (
        <ProductForm
          productForm={productForm}
          onNameChange={handleNameChange}
          onDescriptionChange={handleDescriptionChange}
          onPriceChange={handlePriceChange}
          onStockChange={handleStockChange}
          onDiscountsChange={handleDiscountsChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
          isEditing={!!editingProductId}
        />
      )}
    </Section>
  );
};

export default ProductManagement;
