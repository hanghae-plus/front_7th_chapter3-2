import Header from "./components/Header";
import Notifications from "./components/Notifications";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { useUIStore } from "./stores/useUIStore";

const App = () => {
  const isAdmin = useUIStore((state) => state.isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 토스트 UI */}
      <Notifications />

      {/* 헤더 */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

export default App;
