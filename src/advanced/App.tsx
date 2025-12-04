import { useCallback, useMemo, useState } from 'react';
import Button from './components/button';
import Header from './components/header';
import { CartIcon } from './components/icons';
import Input from './components/input';
import Toast from './components/toast';
import { PAGES } from './constants/pages';
import useCoupons from './hooks/coupons';
import useDebounce from './hooks/debounce';
import usePage from './hooks/pages';
import useSelectedCoupon from './hooks/selected-coupon';
import AdminPage from './pages/admin';
import StorePage from './pages/store';
import { cartContext } from './stores/cart';

const App = () => {
  const { store, admin } = PAGES;
  const { currentPage, switchPage, isCurrentPage } = usePage(store);
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const { totalItemCount } = cartContext();
  const [selectedCoupon, setSelectedCoupon] = useSelectedCoupon(coupons);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const handleSwitchToAdmin = useCallback(() => switchPage(admin), [switchPage]);
  const handleSwitchToStore = useCallback(() => switchPage(store), [switchPage]);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value), []);

  const nav = useMemo(
    () => ({
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
    }),
    [store, admin, handleSwitchToAdmin, handleSwitchToStore, totalItemCount]
  );

  const page = useMemo(
    () => ({
      [store]: (
        <StorePage
          debouncedSearchTerm={debouncedSearchTerm}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      ),
      [admin]: <AdminPage coupons={coupons} addCoupon={addCoupon} deleteCoupon={deleteCoupon} />
    }),
    [store, admin, debouncedSearchTerm, coupons, selectedCoupon, setSelectedCoupon, addCoupon, deleteCoupon]
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toast />
      <Header nav={nav[currentPage]}>
        {isCurrentPage(store) && <Input type='search' value={searchTerm} onChange={handleSearchChange} placeholder='상품 검색...' />}
      </Header>

      <main className='max-w-7xl mx-auto px-4 py-8'>{page[currentPage]}</main>
    </div>
  );
};

export default App;
