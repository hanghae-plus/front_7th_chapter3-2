import { useProductStore } from '../../../entities/product/model/useProductStore';
import { useNotificationStore } from '../../../shared/store/useNotificationStore';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  const {
    products,
    showProductForm,
    editingProduct,
    productForm,
    setShowProductForm,
    setEditingProduct,
    setProductForm,
    startEditProduct,
    deleteProduct,
    addProduct,
    updateProduct,
    resetForm,
  } = useProductStore();

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleAddNew = () => {
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

  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      addNotification('상품이 수정되었습니다.', 'success');
    } else {
      addProduct(productForm);
      addNotification('상품이 추가되었습니다.', 'success');
    }
    resetForm();
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={startEditProduct}
        onDelete={handleDelete}
      />

      {showProductForm && (
        <ProductForm
          isNew={editingProduct === 'new'}
          formData={productForm}
          onSetFormData={setProductForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductManagement;
