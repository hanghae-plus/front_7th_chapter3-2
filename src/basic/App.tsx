import { useCallback, useEffect, useState } from 'react';
import Button from './components/button';
import Header from './components/header';
import { CartIcon } from './components/icons';
import Input from './components/input';
import Toast from './components/toast';
import { initialCoupons } from './constants/coupons';
import { PAGES } from './constants/pages';
import { initialProducts } from './constants/products';
import useNotifications from './hooks/notifications';
import usePage from './hooks/pages';
import AdminPage from './pages/admin';
import StorePage from './pages/store';
import { CartItem } from './types/carts';
import { Coupon } from './types/coupons';
import { ProductWithUI } from './types/products';

const App = () => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { store, admin } = PAGES;
  const { currentPage, switchPage, isCurrentPage } = usePage(store);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`
      };
      setProducts(prev => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev => prev.map(product => (product.id === productId ? { ...product, ...updates } : product)));
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
  );
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons(prev => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  const nav = {
    [store]: (
      <>
        <Button size='xs' variant='text' onClick={() => switchPage(admin)}>
          관리자 페이지로
        </Button>
        <div className='relative'>
          <CartIcon className='text-gray-700' />
          {cart.length > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
              {totalItemCount}
            </span>
          )}
        </div>
      </>
    ),
    [admin]: (
      <Button size='xs' variant='dark' onClick={() => switchPage(store)}>
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
        setCart={setCart}
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
        {isCurrentPage(store) && <Input type='search' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='상품 검색...' />}
      </Header>

      <main className='max-w-7xl mx-auto px-4 py-8'>{page[currentPage]}</main>
    </div>
  );
};

export default App;
