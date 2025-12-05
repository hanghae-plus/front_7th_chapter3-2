import { useState } from "react";
import { ProductWithUI } from "../../../../types";
import { formatAdminPrice } from "../../../utils/formatters";
import { useProductForm } from "../hooks/useProductForm";
import { ProductForm } from "./ProductForm";

type ProductManagementProps = {
  products: {
    value: ProductWithUI[];
    add: (p: Omit<ProductWithUI, "id">) => void;
    update: (id: string, updates: Partial<ProductWithUI>) => void;
    delete: (id: string) => void;
  };
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
};

export function ProductManagement({
  products,
  addNotification,
}: ProductManagementProps) {
  const [showProductForm, setShowProductForm] = useState(false);
  const {
    productForm,
    editingProduct,
    startEditProduct,
    startAddProduct,
    handleSubmit,
    resetForm,
    handleChange,
    handlePriceBlur,
    handleStockBlur,
    handleDiscountChange,
    handleRemoveDiscount,
    handleAddDiscount,
  } = useProductForm({
    onAdd: (product) => {
      products.add(product);
      setShowProductForm(false);
    },
    onUpdate: (id, product) => {
      products.update(id, product);
      setShowProductForm(false);
    },
    addNotification,
  });

  const handleEditProduct = (product: ProductWithUI) => {
    startEditProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    startAddProduct();
    setShowProductForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.value.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatAdminPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}개
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {product.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => products.delete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && (
        <ProductForm
          productForm={productForm}
          editingProduct={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onChange={handleChange}
          onPriceBlur={handlePriceBlur}
          onStockBlur={handleStockBlur}
          onDiscountChange={handleDiscountChange}
          onRemoveDiscount={handleRemoveDiscount}
          onAddDiscount={handleAddDiscount}
        />
      )}
    </section>
  );
}
