import { useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../models/product';
import {
  useProductStore,
  useCouponStore,
  useAppStore,
  useAdminFormStore,
} from '../stores';
import { MESSAGES } from '../constants';
import { ProductManagement } from '../components/admin/ProductManagement';
import { CouponManagement } from '../components/admin/CouponManagement';

export function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const { coupons, addCoupon, removeCoupon } = useCouponStore();
  const { addNotification } = useAppStore();

  const {
    activeTab,
    setActiveTab,
    showProductForm,
    editingProduct,
    productForm,
    showCouponForm,
    couponForm,
    resetProductForm,
    startEditProduct,
    startAddProduct,
    resetCouponForm,
    toggleCouponForm,
    handleProductNameChange,
    handleProductDescriptionChange,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
    handleDiscountsChange,
    handleCouponNameChange,
    handleCouponCodeChange,
    handleCouponTypeChange,
    handleDiscountValueChange,
    handleDiscountValueBlur,
  } = useAdminFormStore();

  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      addNotification(MESSAGES.PRODUCT_ADDED, 'success');
    },
    [addProduct, addNotification]
  );

  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification(MESSAGES.PRODUCT_UPDATED, 'success');
    },
    [updateProduct, addNotification]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification(MESSAGES.PRODUCT_DELETED, 'success');
    },
    [deleteProduct, addNotification]
  );

  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const success = addCoupon(newCoupon);
      if (success) {
        addNotification(MESSAGES.COUPON_ADDED, 'success');
      } else {
        addNotification(MESSAGES.DUPLICATE_COUPON_CODE, 'error');
      }
    },
    [addCoupon, addNotification]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      removeCoupon(couponCode);
      addNotification(MESSAGES.COUPON_DELETED, 'success');
    },
    [removeCoupon, addNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      handleUpdateProduct(editingProduct, productForm);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    resetProductForm();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    resetCouponForm();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors ' +
              (activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
            }
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors ' +
              (activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
            }
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          showProductForm={showProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          onStartAdd={startAddProduct}
          onStartEdit={startEditProduct}
          onDelete={handleDeleteProduct}
          onSubmit={handleProductSubmit}
          onCancel={resetProductForm}
          onNameChange={handleProductNameChange}
          onDescriptionChange={handleProductDescriptionChange}
          onPriceChange={handlePriceChange}
          onPriceBlur={(value) => handlePriceBlur(value, addNotification)}
          onStockChange={handleStockChange}
          onStockBlur={(value) => handleStockBlur(value, addNotification)}
          onDiscountsChange={handleDiscountsChange}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          onToggleForm={toggleCouponForm}
          onDelete={handleDeleteCoupon}
          onSubmit={handleCouponSubmit}
          onCancel={resetCouponForm}
          onNameChange={handleCouponNameChange}
          onCodeChange={handleCouponCodeChange}
          onTypeChange={handleCouponTypeChange}
          onValueChange={handleDiscountValueChange}
          onValueBlur={() => handleDiscountValueBlur(addNotification)}
        />
      )}
    </div>
  );
}
