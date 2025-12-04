import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { ProductWithUI } from '../../product/hook/useProduct';
import { AddNewProductButton } from './AddNewProductButton';
import { ProductAddForm } from './ProductAddForm';
import { AdminProductTable } from './AdminProductTable';

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export const AdminProductList = ({
  products,
  setProducts,
  addNotification,
}: {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  addNotification: (message: string, type: 'success' | 'error') => void;
}) => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  });
  const [showProductForm, setShowProductForm] = useState(false);

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

  const handleAddNewProduct = () => {
    setEditingProduct('new');
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setShowProductForm(true);
  };

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product,
        ),
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification],
  );

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
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <AddNewProductButton onClick={handleAddNewProduct} />
        </div>
      </div>
      <AdminProductTable
        products={products}
        startEditProduct={startEditProduct}
        deleteProduct={deleteProduct}
      />

      {showProductForm && (
        <ProductAddForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          addNotification={addNotification}
          setProducts={setProducts}
          setEditingProduct={setEditingProduct}
          handleProductSubmit={handleProductSubmit}
        />
      )}
    </section>
  );
};
