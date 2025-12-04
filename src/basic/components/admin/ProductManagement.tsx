import React from 'react';
import { ProductWithUI } from '../../hooks/useProducts';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';

interface ProductManagementProps {
  products: ProductWithUI[];
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  formatPrice: (price: number, productId?: string) => string;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProductClick: () => void;
  onProductFormChange: (form: any) => void;
  onProductSubmit: (e: React.FormEvent) => void;
  onProductFormCancel: () => void;
  onAddNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  showProductForm,
  editingProduct,
  productForm,
  formatPrice,
  onEditProduct,
  onDeleteProduct,
  onAddProductClick,
  onProductFormChange,
  onProductSubmit,
  onProductFormCancel,
  onAddNotification,
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <ProductTable
        products={products}
        formatPrice={formatPrice}
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
          onAddNotification={onAddNotification}
        />
      )}
    </section>
  );
};
