import { useUIStore, useCartStore } from './stores';
import { Header, NotificationList } from './components/common';
import { ProductList } from './components/product';
import { Cart, CartSummary } from './components/cart';
import { CouponSelector } from './components/coupon';
import { AdminPage } from './components/admin';

const App = () => {
  const isAdmin = useUIStore((state) => state.isAdmin);
  const cartLength = useCartStore((state) => state.cart.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ProductList />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Cart />

                {cartLength > 0 && (
                  <>
                    <CouponSelector />
                    <CartSummary />
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
