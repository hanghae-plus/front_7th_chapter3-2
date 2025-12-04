import { useState, type FC } from "react";
import ProductListTable from "../../components/adminPage/ProductListTable";
import ProductForm from "../../components/adminPage/ProductForm";
import { useProducts } from "../../hooks/useProducts";
import { ProductWithUI } from "../../../types";
import Section from "../../components/_common/Section";
import Button from "../../components/_common/Button";
import { useForm } from "../../utils/hooks/useForm";
import { Notification } from "../../models/notificiation";
import { validateStock, validatePrice } from "../../models/validation";

const INITIAL_PRODUCT_FORM: Omit<ProductWithUI, "id"> = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};
interface IProps {
  addNotification: (message: string, type: Notification["type"]) => void;
}
const ProductManagement: FC<IProps> = ({ addNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const {
    values: productForm,
    handleChange,
    resetForm,
    setValues: setProductForm,
  } = useForm<Omit<ProductWithUI, "id">>(INITIAL_PRODUCT_FORM);

  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification);

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
    // 빈 문자열이거나 순수 숫자가 아니면 무시
    if (value !== "" && !/^\d+$/.test(value)) {
      return; // 이전 값 유지
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
    // 빈 문자열이거나 순수 숫자가 아니면 무시
    if (value !== "" && !/^\d+$/.test(value)) {
      return; // 이전 값 유지
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
