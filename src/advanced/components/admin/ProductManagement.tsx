import React from 'react';
import { ProductWithUI } from '../../hooks/useProducts';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';

interface ProductManagementProps {
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProductClick: () => void;
  onProductFormChange: (form: any) => void;
  onProductSubmit: (e: React.FormEvent) => void;
  onProductFormCancel: () => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  showProductForm,
  editingProduct,
  productForm,
  onEditProduct,
  onDeleteProduct,
  onAddProductClick,
  onProductFormChange,
  onProductSubmit,
  onProductFormCancel,
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <ProductTable
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        onAddProduct={onAddProductClick}
      />

      {showProductForm && (
        <ProductForm
          isVisible={showProductForm}
          isEditing={editingProduct !== 'new'}
          productForm={productForm}
          onFormChange={onProductFormChange}
          onSubmit={onProductSubmit}
          onCancel={onProductFormCancel}
        />
      )}
    </section>
  );
};
