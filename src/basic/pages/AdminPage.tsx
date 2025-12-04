import React from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { Coupon } from '../../types';
import {
  CouponManagement,
  ProductFormModal,
  ProductTable,
} from '../components/admin';

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  activeTab: 'products' | 'coupons';
  showProductForm: boolean;
  showCouponForm: boolean;
  editingProduct: string | null;
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  formatPrice: (price: number, productId?: string) => string;
  onSetActiveTab: (tab: 'products' | 'coupons') => void;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProductClick: () => void;
  onProductFormChange: (form: any) => void;
  onProductSubmit: (e: React.FormEvent) => void;
  onProductFormCancel: () => void;
  onDeleteCoupon: (couponCode: string) => void;
  onToggleCouponForm: () => void;
  onCouponFormChange: (form: any) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onCouponFormCancel: () => void;
  onAddNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  coupons,
  activeTab,
  showProductForm,
  showCouponForm,
  editingProduct,
  productForm,
  couponForm,
  formatPrice,
  onSetActiveTab,
  onEditProduct,
  onDeleteProduct,
  onAddProductClick,
  onProductFormChange,
  onProductSubmit,
  onProductFormCancel,
  onDeleteCoupon,
  onToggleCouponForm,
  onCouponFormChange,
  onCouponSubmit,
  onCouponFormCancel,
  onAddNotification,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onSetActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => onSetActiveTab('coupons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <>
          <ProductTable
            products={products}
            formatPrice={formatPrice}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onAddProduct={onAddProductClick}
          />
          <ProductFormModal
            isVisible={showProductForm}
            isEditing={editingProduct !== 'new'}
            productForm={productForm}
            onFormChange={onProductFormChange}
            onSubmit={onProductSubmit}
            onCancel={onProductFormCancel}
            onAddNotification={onAddNotification}
          />
        </>
      ) : (
        <CouponManagement
          coupons={coupons}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          onDeleteCoupon={onDeleteCoupon}
          onToggleCouponForm={onToggleCouponForm}
          onCouponFormChange={onCouponFormChange}
          onCouponSubmit={onCouponSubmit}
          onCouponFormCancel={onCouponFormCancel}
          onAddNotification={onAddNotification}
        />
      )}
    </div>
  );
};
