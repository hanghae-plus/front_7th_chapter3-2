import { useProducts } from "../../../domains/products/contexts/ProductsContext";
import { ProductList } from "./ProductList/ProductList";
import { ProductForm } from "./ProductForm/ProductForm";
import { useProductForm } from "../../../domains/products/hooks/useProductForm";

export function ProductsSection() {
  const products = useProducts();
  const {
    editingProduct,
    productForm,
    showProductForm,
    updateForm,
    handleProductSubmit,
    startEditProduct,
    startAddProduct,
    handleFormCancel,
    deleteProduct,
  } = useProductForm();

  const productRows = products.list.map((product) => ({
    id: product.id,
    name: product.name,
    priceLabel: product.priceLabel(),
    stock: product.stock,
    description: product.description,
    onEdit: () => startEditProduct(product),
    onDelete: () => deleteProduct(product.id),
  }));

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={startAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductList products={productRows} />

      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          onFormChange={updateForm}
          onSubmit={handleProductSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </section>
  );
}

