import { useState } from 'react';
import { ToastProvider, useToast } from './shared/ui/toast';
import { AdminPage } from './pages/admin/page';
import { CartPage } from './pages/cart/page';
import { useProducts } from './entities/product';
import { useCoupons } from './entities/coupon';
import { useCart } from './entities/cart/use-cart.model';

const App = () => {
  const { notifications, addNotification, removeNotification } = useToast();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const { coupons, addCoupon, removeCoupon } = useCoupons();

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

  return (
    <>
      <ToastProvider
        notifications={notifications}
        onClose={removeNotification}
      />

      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          toast={addNotification}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          addCoupon={addCoupon}
          removeCoupon={removeCoupon}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
        />
      ) : (
        <CartPage
          cart={cart}
          products={products}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          toast={addNotification}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onApplyCoupon={applyCoupon}
          onGetRemainingStock={getRemainingStock}
          onClearCart={clearCart}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
        />
      )}
    </>
  );
};

export default App;
