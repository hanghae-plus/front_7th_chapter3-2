import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

import Notifications from './components/notifications';
import Header from './components/layout/Header';
import { useDebounce } from './utils/hooks/useDebounce';
import { initialProducts, initialCoupons } from './constants';

import {
  isAdminAtom,
  searchTermAtom,
  debouncedSearchTermAtom,
  notificationsAtom,
  removeNotificationAtom,
  productsAtom,
  couponsAtom
} from './atoms';

const App = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const setProducts = useSetAtom(productsAtom);
  const setCoupons = useSetAtom(couponsAtom);
  const setDebouncedSearchTerm = useSetAtom(debouncedSearchTermAtom);
  const removeNotification = useSetAtom(removeNotificationAtom);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 초기화 - localStorage 기반으로 체크하고 UI 상태 초기화
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedCoupons = localStorage.getItem('coupons');
    
    // localStorage가 비어있으면 초기값 설정
    if (!storedProducts) {
      setProducts(initialProducts);
    }
    if (!storedCoupons) {
      setCoupons(initialCoupons);
    }
    
    // UI 상태 초기화 (테스트용)
    setIsAdmin(false);
    setSearchTerm('');
    setNotifications([]);
  }, []);

  // Debounced search term을 atom에 동기화
  useEffect(() => {
    setDebouncedSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setDebouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && 
        <Notifications 
          notifications={notifications} 
          onRemove={(id) => removeNotification(id)} 
        />
      }
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

export default App;
