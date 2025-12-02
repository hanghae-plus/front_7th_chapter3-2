import { useState, useMemo } from 'react';
import { ToastProvider, useToast } from './shared/ui/toast';
import { Header } from './widgets/header.ui';
import { AdminPage } from './pages/admin/page';
import { CartPage } from './pages/cart/page';
import { useProducts } from './entities/product';
import { useCoupons } from './entities/coupon';
import { useDebounce } from './shared/hooks/use-debounce';
import { useCart } from './entities/cart/use-cart.model';

// 초기 데이터

const App = () => {
  const { notifications, addNotification, removeNotification } = useToast();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts({
    toast: addNotification,
  });

  const { coupons, addCoupon, removeCoupon } = useCoupons({
    toast: addNotification,
  });

  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    clearCart,
  } = useCart({
    toast: addNotification,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider
        notifications={notifications}
        onClose={removeNotification}
      />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        totalItemCount={totalItemCount}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onChangeSearchTerm={setSearchTerm}
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
            onRemoveCoupon={removeCoupon}
            toast={addNotification}
          />
        ) : (
          <CartPage
            cart={cart}
            products={products}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onAddNotification={addNotification}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onGetRemainingStock={getRemainingStock}
            onClearCart={clearCart}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
