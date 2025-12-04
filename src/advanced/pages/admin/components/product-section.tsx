import { useState } from 'react';
import Button from '../../../components/button';
import { AddNotification } from '../../../hooks/notifications';
import useToggle from '../../../hooks/toggle';
import { ProductWithUI } from '../../../types/products';
import ProductForm from './product-form';
import ProductList from './product-list';

interface ProductSectionProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addNotification: AddNotification;
}

const ProductSection = ({ products, addProduct, updateProduct, deleteProduct, addNotification }: ProductSectionProps) => {
  const { isOpen, open, close } = useToggle(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <Button
            size='sm'
            variant='dark'
            onClick={() => {
              setEditingProduct('new');
              open();
            }}
          >
            새 상품 추가
          </Button>
        </div>
      </div>
      <ProductList products={products} setEditingProduct={setEditingProduct} deleteProduct={deleteProduct} open={open} />
      {isOpen && (
        <ProductForm
          products={products}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          addProduct={addProduct}
          updateProduct={updateProduct}
          close={close}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductSection;
