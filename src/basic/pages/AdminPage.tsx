import React, { useState } from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { Coupon } from '../../types';
import { CouponManagement, ProductManagement } from '../components/admin';
import { Tabs } from '../components/primitives';

interface AdminPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  formatPrice: (price: number, productId?: string) => string;
  onAddProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponCode: string) => void;
  onAddNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  coupons,
  formatPrice,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCoupon,
  onDeleteCoupon,
  onAddNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const handleAddProductClick = () => {
    setEditingProduct('new');
    setShowProductForm(true);
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
  };

  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setShowProductForm(true);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Omit<ProductWithUI, 'id'> = {
      ...productForm,
      discounts: productForm.discounts.filter(
        (d) => d.quantity > 0 && d.rate > 0
      ),
    };

    if (editingProduct === 'new') {
      onAddProduct(newProduct);
    } else if (editingProduct) {
      onUpdateProduct(editingProduct, newProduct);
    }

    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleProductFormCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleToggleCouponForm = () => {
    setShowCouponForm(!showCouponForm);
    if (!showCouponForm) {
      setCouponForm({
        name: '',
        code: '',
        discountType: 'amount',
        discountValue: 0,
      });
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCoupon(couponForm);
    setShowCouponForm(false);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
  };

  const handleCouponFormCancel = () => {
    setShowCouponForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="products">상품 관리</Tabs.Tab>
          <Tabs.Tab value="coupons">쿠폰 관리</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          showProductForm={showProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          formatPrice={formatPrice}
          onEditProduct={handleEditProduct}
          onDeleteProduct={onDeleteProduct}
          onAddProductClick={handleAddProductClick}
          onProductFormChange={setProductForm}
          onProductSubmit={handleProductSubmit}
          onProductFormCancel={handleProductFormCancel}
          onAddNotification={onAddNotification}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          onDeleteCoupon={onDeleteCoupon}
          onToggleCouponForm={handleToggleCouponForm}
          onCouponFormChange={setCouponForm}
          onCouponSubmit={handleCouponSubmit}
          onCouponFormCancel={handleCouponFormCancel}
          onAddNotification={onAddNotification}
        />
      )}
    </div>
  );
};
