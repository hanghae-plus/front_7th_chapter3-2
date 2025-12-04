import React, { useState } from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { CouponManagement, ProductManagement } from '../components/admin';
import { Tabs } from '../components/primitives';
import {
  useProductsContext,
  useCouponsContext,
  useNotificationsContext,
} from '../contexts';

export const AdminPage: React.FC = () => {
  const { addProduct, updateProduct, deleteProduct } = useProductsContext();
  const { coupons, addCoupon } = useCouponsContext();
  const { addNotification } = useNotificationsContext();

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
      addProduct(newProduct);
      addNotification('상품이 추가되었습니다.', 'success');
    } else if (editingProduct) {
      updateProduct(editingProduct, newProduct);
      addNotification('상품이 수정되었습니다.', 'success');
    }

    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleProductFormCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
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

    const existingCoupon = coupons.find((c) => c.code === couponForm.code);
    if (existingCoupon) {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }

    addCoupon(couponForm);
    addNotification('쿠폰이 추가되었습니다.', 'success');
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
          showProductForm={showProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddProductClick={handleAddProductClick}
          onProductFormChange={setProductForm}
          onProductSubmit={handleProductSubmit}
          onProductFormCancel={handleProductFormCancel}
        />
      ) : (
        <CouponManagement
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          onToggleCouponForm={handleToggleCouponForm}
          onCouponFormChange={setCouponForm}
          onCouponSubmit={handleCouponSubmit}
          onCouponFormCancel={handleCouponFormCancel}
        />
      )}
    </div>
  );
};
