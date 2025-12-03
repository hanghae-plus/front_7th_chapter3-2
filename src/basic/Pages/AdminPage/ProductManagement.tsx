import { useState, type FC } from "react";
import ProductListTable from "../../components/adminPage/ProductListTable";
import ProductForm from "../../components/adminPage/ProductForm";
import { useProducts } from "../../hooks/useProducts";
import { ProductWithUI } from "../../../types";

interface IProps {}

const INITIAL_PRODUCT_FORM: Omit<ProductWithUI, "id"> = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

const ProductManagement: FC<IProps> = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] =
    useState<Omit<ProductWithUI, "id">>(INITIAL_PRODUCT_FORM);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const handleAddNew = () => {
    setProductForm(INITIAL_PRODUCT_FORM);
    setEditingProductId(null);
    setShowForm(true);
  };

  const handleEditStart = (product: ProductWithUI) => {
    const { id, ...formData } = product;
    setProductForm(formData);
    setEditingProductId(id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct({ ...productForm, id: editingProductId });
    } else {
      addProduct(productForm);
    }
    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductListTable
        products={products}
        onEdit={handleEditStart}
        onDelete={deleteProduct}
      />

      {showForm && (
        <ProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          onSubmit={handleSubmit}
          onClose={handleClose}
          isEditing={!!editingProductId}
        />
      )}
    </section>
  );
};

export default ProductManagement;
