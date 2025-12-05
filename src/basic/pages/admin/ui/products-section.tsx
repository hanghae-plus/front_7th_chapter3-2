import { useState } from 'react';
import { ProductWithUI } from '../../../entities/product';

import { ToastProps } from '../../../shared/ui/toast';
import { ProductsTable } from './products-table';
import { CreateProductForm } from '../../../features/product/create-product';
import { EditProductForm } from '../../../features/product/edit-product';
import { ConditionalRender } from '../../../shared/ui/conditional-render';

interface ProductsSectionProps {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  toast: (notification: ToastProps) => void;
}

export function ProductsSection({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  toast,
}: ProductsSectionProps) {
  const [openProductFormType, setOpenProductFormType] = useState<
    'create' | 'edit' | null
  >(null);

  const [selectedProduct, setSelectedProduct] = useState<ProductWithUI | null>(
    null
  );

  const handleOpenCreateProductForm = () => {
    setOpenProductFormType('create');
  };

  const handleCloseCreateProductForm = () => {
    setOpenProductFormType(null);
  };

  const handleOpenEditProductForm = (product: ProductWithUI) => {
    setOpenProductFormType('edit');
    setSelectedProduct(product);
  };

  const handleCloseEditProductForm = () => {
    setOpenProductFormType(null);
    setSelectedProduct(null);
  };

  const showCreateProductForm = openProductFormType === 'create';
  const showEditProductForm =
    openProductFormType === 'edit' && !!selectedProduct;

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleOpenCreateProductForm}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductsTable
          products={products}
          deleteProduct={deleteProduct}
          onOpenProductForm={handleOpenEditProductForm}
          toast={toast}
        />
      </div>

      <ConditionalRender condition={showCreateProductForm}>
        <CreateProductForm
          addProduct={addProduct}
          onCloseProductForm={handleCloseCreateProductForm}
          toast={toast}
        />
      </ConditionalRender>

      <ConditionalRender condition={showEditProductForm}>
        <EditProductForm
          product={selectedProduct!}
          updateProduct={updateProduct}
          onCloseProductForm={handleCloseEditProductForm}
          toast={toast}
        />
      </ConditionalRender>
    </section>
  );
}
