import { useState } from 'react';
import Button from '../../../components/button';
import useToggle from '../../../hooks/toggle';
import ProductForm from './product-form';
import ProductList from './product-list';

const ProductSection = () => {
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
      <ProductList setEditingProduct={setEditingProduct} open={open} />
      {isOpen && (
        <ProductForm editingProduct={editingProduct} setEditingProduct={setEditingProduct} close={close} />
      )}
    </section>
  );
};

export default ProductSection;
