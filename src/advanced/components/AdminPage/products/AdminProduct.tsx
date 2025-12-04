import AdminProductForm from "./AdminProductForm";
import AdminProductsTable from "./AdminProductsTable";
import { useProductForm } from "../../../hooks/useProductForm";
import { useProductStore } from "../../../stores/useProductStore";

export const AdminProducts = () => {
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const {
    productForm,
    setProductForm,
    showProductForm,
    editingProduct,
    startNewProduct,
    startEditProduct,
    handleProductSubmit,
    resetProductFormState,
  } = useProductForm({ addProduct, updateProduct });

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={startNewProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <AdminProductsTable
          products={products}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
        />
      </div>
      {showProductForm && (
        <AdminProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          handleProductSubmit={handleProductSubmit}
          resetProductFormState={resetProductFormState}
        />
      )}
    </section>
  );
};
