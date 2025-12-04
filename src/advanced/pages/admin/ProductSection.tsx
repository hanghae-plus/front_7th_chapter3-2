import { useState } from 'react';
import { ProductWithUI, Discount } from '../../../types';
import ProductTableRow from '../../components/admin/ProductTableRow';
import ProductForm from '../../components/admin/ProductForm';
import * as cartModel from '../../models/cart';
import { useCartContext, useProductContext } from '../../contexts';

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}

const ProductSection = () => {
  const { cart } = useCartContext();
  const productActions = useProductContext();
  const { products } = productActions;
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithUI | null>(
    null
  );

  const handleProductSubmit = (formData: ProductFormData) => {
    if (editingProduct) {
      productActions.updateProduct(editingProduct.id, formData);
    } else {
      productActions.addProduct(formData);
    }
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    productActions.removeProduct(productId);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleAddNew}
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
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                remainingStock={cartModel.getRemainingStock(product, cart)}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
};

export default ProductSection;
