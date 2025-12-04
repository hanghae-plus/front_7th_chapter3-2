import { ProductFormState, ProductWithUI } from '../../../entities/product/types';
import { useState } from 'react';
import {
  getNewProducts,
  getUpdatedProducts,
  getDeletedProducts,
} from '../../../entities/product/utils';
import ProductForm from './ProductForm';
import ProductListRowItem from './ProductListRowItem';

interface ProductTabProps {
  products: ProductWithUI[];
  setProducts: (products: ProductWithUI[]) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function ProductTab({ products, setProducts, addNotification }: ProductTabProps) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const [productForm, setProductForm] = useState<ProductFormState>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    setProducts(getNewProducts(products, newProduct));
    addNotification('상품이 추가되었습니다.', 'success');
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(getUpdatedProducts(products, productId, updates));
    addNotification('상품이 수정되었습니다.', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts(getDeletedProducts(products, productId));
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct('new');
              setProductForm({
                name: '',
                price: 0,
                stock: 0,
                description: '',
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
            {products.map(product => (
              <ProductListRowItem
                key={product.id}
                product={product}
                startEditProduct={startEditProduct}
                deleteProduct={deleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
          handleProductSubmit={handleProductSubmit}
          addNotification={addNotification}
        />
      )}
    </section>
  );
}
