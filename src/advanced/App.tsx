import { useState } from 'react';
import Header from './widgets/header/ui/Header';
import NotificationList from './widgets/notification/ui/NotificationList';
import AdminPage from './pages/admin/ui/AdminPage';
import CartPage from './pages/cart/ui/CartPage';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList />
      <Header isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

export default App;
