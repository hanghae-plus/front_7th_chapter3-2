import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { ToastProvider, useToast } from './shared/ui/toast';

import { Header } from './widgets/header.ui';
import { AdminPage } from './pages/admin/page';
import { CartPage } from './pages/cart/page';

// 초기 데이터

const App = () => {
  const { notifications, addNotification, removeNotification } = useToast();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [totalItemCount, setTotalItemCount] = useState(0);

  const handleChangeCart = (callback: (cart: CartItem[]) => CartItem[]) => {
    setCart(prevCart => {
      const newCart = callback(prevCart);
      return newCart;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
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
          <AdminPage onAddNotification={addNotification} />
        ) : (
          <CartPage
            cart={cart}
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
