import { useState } from 'react';
import { ProductWithUI } from '../../../entities/product';
import { ProductsTable } from './products-table';
import { CreateProductForm } from '../../../features/product/create-product';
import { EditProductForm } from '../../../features/product/edit-product';
import { ConditionalRender } from '../../../shared/ui/conditional-render';
import { Button } from '../../../shared/ui/button';

interface ProductsSectionProps {}

export function ProductsSection({}: ProductsSectionProps) {
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
          <Button
            variant="dark"
            size="sm"
            onClick={handleOpenCreateProductForm}
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductsTable onOpenProductForm={handleOpenEditProductForm} />
      </div>

      <ConditionalRender condition={showCreateProductForm}>
        <CreateProductForm onCloseProductForm={handleCloseCreateProductForm} />
      </ConditionalRender>

      <ConditionalRender condition={showEditProductForm}>
        <EditProductForm
          product={selectedProduct!}
          onCloseProductForm={handleCloseEditProductForm}
        />
      </ConditionalRender>
    </section>
  );
}
