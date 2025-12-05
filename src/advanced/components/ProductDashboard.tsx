import { useAtomValue, useSetAtom } from "jotai";
import { ProductForm as ProductFormType, ProductWithUI } from "../types";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { useState } from "react";
import {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
} from "../store";
import { useToast } from "../utils/hooks/useToast";

export const getInitialProductForm = (): ProductFormType => ({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
});

export function ProductDashboard() {
  const products = useAtomValue(productsAtom);
  const addProductAction = useSetAtom(addProductAtom);
  const updateProductAction = useSetAtom(updateProductAtom);
  const deleteProductAction = useSetAtom(deleteProductAtom);
  const { notify } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(getInitialProductForm());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProductAction(editingProduct, productForm);
      notify("상품이 수정되었습니다.", "success");
      setEditingProduct(null);
    } else {
      addProductAction({ ...productForm, discounts: productForm.discounts });
      notify("상품이 추가되었습니다.", "success");
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
          onDelete={(productId) => {
            deleteProductAction(productId);
            notify("상품이 삭제되었습니다.", "success");
          }}
        />
      </div>
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          onSubmit={handleSubmit}
          onChange={setProductForm}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
}
