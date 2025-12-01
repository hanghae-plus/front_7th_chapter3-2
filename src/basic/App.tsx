import { useState, useMemo } from 'react';
import { CartItem, Coupon } from '../types';
import { ToastProvider, useToast } from './shared/ui/toast';

import { Header } from './widgets/header.ui';
import { AdminPage } from './pages/admin/page';
import { CartPage } from './pages/cart/page';
import { ProductWithUI } from './entities/product';
import { INITIAL_PRODUCTS } from './entities/product/product-constants.config';
import { INITIAL_COUPONS } from './entities/coupon';
import { useLocalStorage } from './shared/hooks/use-local-storage';
import { useDebounce } from './shared/hooks/use-debounce';

// 초기 데이터

const App = () => {
  const { notifications, addNotification, removeNotification } = useToast();

  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    INITIAL_PRODUCTS,
  );

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    INITIAL_COUPONS,
  );

  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangeCart = (callback: (cart: CartItem[]) => CartItem[]) => {
    setCart(callback);
  };

  const handleChangeProducts = (
    callback: (products: ProductWithUI[]) => ProductWithUI[],
  ) => {
    setProducts(callback);
  };

  const handleChangeCoupons = (callback: (coupons: Coupon[]) => Coupon[]) => {
    setCoupons(callback);
  };

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
            onChangeProducts={handleChangeProducts}
            onChangeCoupons={handleChangeCoupons}
            onAddNotification={addNotification}
          />
        ) : (
          <CartPage
            cart={cart}
            products={products}
            coupons={coupons}
            onAddNotification={addNotification}
            onChangeCart={handleChangeCart}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
