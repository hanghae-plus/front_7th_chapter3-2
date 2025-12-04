import React from "react";
import { ProductWithUI, EMPTY_PRODUCT_FORM } from "../../../constants";
import { Button, Card } from "../../ui";
import { ProductRow } from "./ProductRow";
import { useProducts } from "../../../hooks/useProducts";

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

interface ProductAccordionProps {
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductAccordion = ({
  setEditingProduct,
  setProductForm,
  setShowProductForm,
}: ProductAccordionProps) => {
  const { products } = useProducts();
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

  const handleAddProduct = () => {
    setEditingProduct("new");
    setProductForm(EMPTY_PRODUCT_FORM);
    setShowProductForm(true);
  };

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            variant="primary"
            onClick={handleAddProduct}
            className="bg-gray-900 hover:bg-gray-800"
          >
            새 상품 추가
          </Button>
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
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProductAccordion;
