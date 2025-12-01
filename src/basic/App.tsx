import { useState, useCallback } from 'react';
import { ProductWithUI, NOTIFICATION_DURATION } from './constants';
import { ProductFormData, CouponFormData, EMPTY_PRODUCT_FORM, EMPTY_COUPON_FORM } from './components/features/admin/types';
// hooks import
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
// components import
import { Toast, Notification } from './components/ui/Toast';
import { Header } from './components/layout/Header';
import { CartPage } from './components/pages/CartPage';
import { AdminPage } from './components/features/admin/AdminPage';
// models에서 순수함수 import (계산용)

const App = () => {
  // 알림 상태 관리 (단순 UI 상태)
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 추가
  const addNotification = useCallback((
    message: string,
    type: 'error' | 'success' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, NOTIFICATION_DURATION);
  }, []);

  // 알림 제거
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Hooks 사용
  const [searchTerm, setSearchTerm] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const {
    cart,
    selectedCoupon,
    total,
    totalItemCount,
    addToCart: addToCartHook,
    removeFromCart,
    updateQuantity,
    applyCoupon: applyCouponHook,
    setSelectedCoupon,
    clearCart,
    getRemainingStockForProduct
  } = useCart();

  // UI 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(EMPTY_PRODUCT_FORM);
  const [couponForm, setCouponForm] = useState<CouponFormData>(EMPTY_COUPON_FORM);


  // 가격 포맷팅 함수
  const formatPrice = useCallback((price: number, productId?: string): string => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && getRemainingStockForProduct(product) <= 0) {
        return 'SOLD OUT';
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }
    
    return `₩${price.toLocaleString()}`;
  }, [products, isAdmin, getRemainingStockForProduct]);

  // 장바구니에 상품 추가 (알림 포함)
  const addToCart = useCallback((product: ProductWithUI) => {
    const result = addToCartHook(product);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  }, [addToCartHook, addNotification]);

  // 쿠폰 적용 (알림 포함)
  const applyCoupon = useCallback((coupon: typeof coupons[0]) => {
    const result = applyCouponHook(coupon);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  }, [applyCouponHook, addNotification, coupons]);

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
  }, [addNotification, clearCart]);


  // 상품 추가 (알림 포함)
  const handleAddProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    addProduct(newProduct);
    addNotification('상품이 추가되었습니다.', 'success');
  };

  // 상품 수정 (알림 포함)
  const handleUpdateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    updateProduct(productId, updates);
    addNotification('상품이 수정되었습니다.', 'success');
  };

  // 상품 삭제 (알림 포함)
  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
  };

  // 쿠폰 추가 (알림 포함)
  const handleAddCoupon = (newCoupon: typeof coupons[0]) => {
    const result = addCoupon(newCoupon);
    if (result.success) {
      addNotification(result.message, 'success');
    } else {
      addNotification(result.message, 'error');
    }
  };

  // 쿠폰 삭제 (알림 포함)
  const handleDeleteCoupon = (couponCode: string) => {
    deleteCoupon(couponCode);
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      handleUpdateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts
      });
    }
    setProductForm(EMPTY_PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    setCouponForm(EMPTY_COUPON_FORM);
    setShowCouponForm(false);
  };

  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    setShowProductForm(true);
  }, []);

  // totals는 useCart에서 가져옴

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast notifications={notifications} onRemove={removeNotification} />
      <Header
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            products={products}
            coupons={coupons}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            productForm={productForm}
            setProductForm={setProductForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            handleAddProduct={handleAddProduct}
            handleUpdateProduct={handleUpdateProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleAddCoupon={handleAddCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            handleProductSubmit={handleProductSubmit}
            handleCouponSubmit={handleCouponSubmit}
            startEditProduct={startEditProduct}
            addNotification={addNotification}
            formatPrice={formatPrice}
          />
        ) : (
          <CartPage
            searchTerm={searchTerm}
            cart={cart}
            selectedCoupon={selectedCoupon}
            total={total}
            coupons={coupons}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onSetSelectedCoupon={setSelectedCoupon}
            onClearCart={clearCart}
            onOrder={completeOrder}
            getRemainingStockForProduct={getRemainingStockForProduct}
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;