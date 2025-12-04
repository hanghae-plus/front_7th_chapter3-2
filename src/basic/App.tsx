import { useState, useCallback, useMemo } from 'react';
import { Coupon } from '../types';

// Hooks
import { useCart } from './hooks/useCart';
import { useProducts, ProductWithUI } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useNotification } from './hooks/useNotification';
import { useDebounce } from './hooks/useDebounce';

// Utils
import { formatPrice, filterProducts } from './utils/formatters';

// Components
import { Header, NotificationList } from './components/common';
import { ProductList } from './components/product';
import { Cart, CartSummary } from './components/cart';
import { CouponSelector } from './components/coupon';
import { AdminPage } from './components/admin';

const App = () => {
  // 모드 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  // 엔티티 훅
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, selectedCoupon, addCoupon, deleteCoupon, selectCoupon } = useCoupons();
  const {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemTotal,
    getRemainingStock,
  } = useCart();
  const { notifications, addNotification, removeNotification } = useNotification();

  // 파생 데이터
  const cartTotal = useMemo(
    () => getCartTotal(selectedCoupon),
    [getCartTotal, selectedCoupon]
  );

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedSearchTerm),
    [products, debouncedSearchTerm]
  );

  // 액션 핸들러
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCart(product);
      addNotification(result.message || '', result.success ? 'success' : 'error');
    },
    [addToCart, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number, maxStock: number) => {
      const result = updateQuantity(productId, quantity, maxStock);
      if (!result.success && result.message) {
        addNotification(result.message, 'error');
      }
    },
    [updateQuantity, addNotification]
  );

  const handleSelectCoupon = useCallback(
    (coupon: Coupon | null) => {
      if (coupon) {
        const currentTotal = getCartTotal(null).totalAfterDiscount;
        if (currentTotal < 10000 && coupon.discountType === 'percentage') {
          addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
          return;
        }
        addNotification('쿠폰이 적용되었습니다.', 'success');
      }
      selectCoupon(coupon);
    },
    [getCartTotal, selectCoupon, addNotification]
  );

  const handleCheckout = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    selectCoupon(null);
  }, [addNotification, clearCart, selectCoupon]);

  const handleToggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  // 관리자 가격 포맷터
  const adminFormatPrice = useCallback(
    (price: number) => formatPrice(price, true),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        cartItemCount={totalItemCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddCoupon={addCoupon}
            onDeleteCoupon={deleteCoupon}
            onNotify={addNotification}
            formatPrice={adminFormatPrice}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ProductList
                products={filteredProducts}
                totalCount={products.length}
                searchTerm={debouncedSearchTerm}
                getRemainingStock={getRemainingStock}
                onAddToCart={handleAddToCart}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Cart
                  items={cart}
                  getItemTotal={getItemTotal}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={removeFromCart}
                />

                {cart.length > 0 && (
                  <>
                    <CouponSelector
                      coupons={coupons}
                      selectedCoupon={selectedCoupon}
                      onSelect={handleSelectCoupon}
                    />

                    <CartSummary total={cartTotal} onCheckout={handleCheckout} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
