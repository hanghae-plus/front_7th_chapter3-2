import { useAtom, useAtomValue } from "jotai";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { Toast } from "./components/ui/Toast";
import { CartCounter } from "./components/CartCounter";
import { ProductSearchBar } from "./components/ProductSearchBar";
import { useToast } from "./utils/hooks/useToast";
import { isAdminAtom, searchTermAtom, totalItemCountAtom } from "./store";

const App = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const { notifications } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notification) => (
            <Toast key={notification.id} notification={notification} />
          ))}
        </div>
      )}
      <Header>
        {!isAdmin && (
          <ProductSearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
        )}
        <nav className="flex ml-auto items-center space-x-4">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              isAdmin
                ? "bg-gray-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
          </button>
          {!isAdmin && <CartCounter totalItemCount={totalItemCount} />}
        </nav>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

export default App;
