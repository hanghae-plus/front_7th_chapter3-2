import React from 'react';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { useProductForm } from '../../hooks/useProductForm';

export const ProductManagement: React.FC = () => {
  const {
    showForm,
    isEditing,
    formData,
    setFormData,
    handleAddClick,
    handleEdit,
    handleSubmit,
    handleCancel,
    handleDelete,
  } = useProductForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <ProductTable
        onEditProduct={handleEdit}
        onDeleteProduct={handleDelete}
        onAddProduct={handleAddClick}
      />

      {showForm && (
        <ProductForm
          isVisible={showForm}
          isEditing={isEditing}
          productForm={formData}
          onFormChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
};
