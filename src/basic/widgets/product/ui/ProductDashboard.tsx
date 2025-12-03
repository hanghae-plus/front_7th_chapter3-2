import { ProductForm as ProductFormType, ProductWithUI } from "../../../types";
import { ProductForm } from "../../../features/control-product-form/ui/ProductForm";
import { ProductTable } from "../../../entities/product/ui/ProductTable";

export function ProductDashboard({
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  products,
  formatPrice,
  startEditProduct,
  deleteProduct,
  showProductForm,
  handleProductSubmit,
  editingProduct,
  productForm,
  addNotification,
}: {
  setEditingProduct: (id: string | null) => void;
  setProductForm: (product: ProductFormType) => void;
  setShowProductForm: (show: boolean) => void;
  products: ProductWithUI[];
  formatPrice: (price: number, productId?: string) => string;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
  showProductForm: boolean;
  handleProductSubmit: (e: React.FormEvent) => void;
  editingProduct: string | null;
  productForm: ProductFormType;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}) {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductTable
          products={products}
          formatPrice={formatPrice}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
        />
      </div>
      {showProductForm && (
        <ProductForm
          handleProductSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          addNotification={addNotification}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
        />
      )}
    </section>
  );
}
