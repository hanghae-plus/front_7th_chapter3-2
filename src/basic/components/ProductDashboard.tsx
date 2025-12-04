import { ProductForm as ProductFormType, ProductWithUI } from "../types";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { useState } from "react";

export const getInitialProductForm = (): ProductFormType => ({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});

export function ProductDashboard({
  products,
  deleteProduct,
  notify,
  updateProduct,
  addProduct,
}: {
  products: ProductWithUI[];
  deleteProduct: (productId: string) => void;
  notify: (message: string, type: "error" | "success" | "warning") => void;
  updateProduct: (productId: string, product: ProductFormType) => void;
  addProduct: (product: ProductFormType) => void;
}) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(getInitialProductForm());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({ ...productForm, discounts: productForm.discounts });
    }
    setProductForm(getInitialProductForm());
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCreateProduct = () => {
    setEditingProduct("new");
    setProductForm(getInitialProductForm());
    setShowProductForm(true);
  };

  const handleEditProduct = (product: ProductWithUI) => {
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

  const handleCancel = () => {
    setEditingProduct(null);
    setProductForm(getInitialProductForm());
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleCreateProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
        />
      </div>
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          onSubmit={handleSubmit}
          onChange={setProductForm}
          onCancel={handleCancel}
          notify={notify}
        />
      )}
    </section>
  );
}
