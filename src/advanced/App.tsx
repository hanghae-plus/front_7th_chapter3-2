import { ToastProvider } from './shared/ui/toast/toast-context';
import { CartProvider } from './entities/cart/model/use-cart';
import { ProductProvider } from './entities/product';
import { CouponProvider } from './entities/coupon';
import { AdminProvider, useAdmin } from './shared/hooks/use-admin';
import { AdminPage } from './pages/admin/page';
import { CartPage } from './pages/cart/page';

function AppContent() {
  const { isAdmin } = useAdmin();

  return isAdmin ? <AdminPage /> : <CartPage />;
}

const App = () => {
  return (
    <ToastProvider>
      <AdminProvider>
        <ProductProvider>
          <CouponProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </CouponProvider>
        </ProductProvider>
      </AdminProvider>
    </ToastProvider>
  );
};

export default App;
