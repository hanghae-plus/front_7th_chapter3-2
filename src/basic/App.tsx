import { useCallback, useState } from 'react';
import Button from './components/button';
import Header from './components/header';
import { CartIcon } from './components/icons';
import Input from './components/input';
import Toast from './components/toast';
import { PAGES } from './constants/pages';
import useCart from './hooks/cart';
import useCoupons from './hooks/coupons';
import useDebounce from './hooks/debounce';
import useNotifications from './hooks/notifications';
import usePage from './hooks/pages';
import useProducts from './hooks/products';
import useSelectedCoupon from './hooks/selected-coupon';
import AdminPage from './pages/admin';
import StorePage from './pages/store';

const App = () => {
  const { store, admin } = PAGES;
  const { currentPage, switchPage, isCurrentPage } = usePage(store);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(addNotification);
  const { coupons, addCoupon, deleteCoupon } = useCoupons(addNotification);
  const { cart, totalItemCount, addToCart, removeFromCart, updateQuantity, clearCart } = useCart(addNotification);
  const [selectedCoupon, setSelectedCoupon] = useSelectedCoupon(coupons);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const handleSwitchToAdmin = useCallback(() => switchPage(admin), [switchPage]);
  const handleSwitchToStore = useCallback(() => switchPage(store), [switchPage]);

  const nav = {
    [store]: (
      <>
        <Button size='xs' variant='text' onClick={handleSwitchToAdmin}>
          관리자 페이지로
        </Button>
        <div className='relative'>
          <CartIcon className='text-gray-700' />
          {totalItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
              {totalItemCount}
            </span>
          )}
        </div>
      </>
    ),
    [admin]: (
      <Button size='xs' variant='dark' onClick={handleSwitchToStore}>
        쇼핑몰로 돌아가기
      </Button>
    )
  };

  const page = {
    [store]: (
      <StorePage
        products={products}
        debouncedSearchTerm={debouncedSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        addNotification={addNotification}
      />
    ),
    [admin]: (
      <AdminPage
        products={products}
        coupons={coupons}
        addNotification={addNotification}
        addProduct={addProduct}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        addCoupon={addCoupon}
        deleteCoupon={deleteCoupon}
      />
    )
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toast notifications={notifications} onClose={removeNotification} />
      <Header nav={nav[currentPage]}>
        {isCurrentPage(store) && (
          <Input type='search' value={searchTerm} onChange={({ target }) => setSearchTerm(target.value)} placeholder='상품 검색...' />
        )}
      </Header>

      <main className='max-w-7xl mx-auto px-4 py-8'>{page[currentPage]}</main>
    </div>
  );
};

export default App;
