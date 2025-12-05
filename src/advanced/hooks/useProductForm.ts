import { useState, useCallback } from 'react';
import { ProductWithUI } from './useProducts';
import { useProductsContext, useNotificationsContext } from '../contexts';

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

const initialFormData: ProductFormData = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};

export const useProductForm = () => {
  const { addProduct, updateProduct, deleteProduct } = useProductsContext();
  const { addNotification } = useNotificationsContext();

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const isEditing = editingProductId !== null && editingProductId !== 'new';

  const handleAddClick = useCallback(() => {
    setEditingProductId('new');
    setShowForm(true);
    setFormData(initialFormData);
  }, []);

  const handleEdit = useCallback((product: ProductWithUI) => {
    setEditingProductId(product.id);
    setShowForm(true);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newProduct: Omit<ProductWithUI, 'id'> = {
        ...formData,
        discounts: formData.discounts.filter(
          (d) => d.quantity > 0 && d.rate > 0
        ),
      };

      if (editingProductId === 'new') {
        addProduct(newProduct);
        addNotification('상품이 추가되었습니다.', 'success');
      } else if (editingProductId) {
        updateProduct(editingProductId, newProduct);
        addNotification('상품이 수정되었습니다.', 'success');
      }

      setShowForm(false);
      setEditingProductId(null);
    },
    [formData, editingProductId, addProduct, updateProduct, addNotification]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingProductId(null);
  }, []);

  const handleDelete = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [deleteProduct, addNotification]
  );

  return {
    showForm,
    isEditing,
    formData,
    setFormData,
    handleAddClick,
    handleEdit,
    handleSubmit,
    handleCancel,
    handleDelete,
  };
};
