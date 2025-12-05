import { useDebounce } from './utils/hooks/useDebounce';
import { useAppStore } from './stores';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { Header } from './components/shared/Header';
import { UIToast } from './components/ui/UIToast';
import { SEARCH_DEBOUNCE_DELAY } from './constants';

const App = () => {
  const { isAdmin, searchTerm, notifications, removeNotification } =
    useAppStore();
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  return (
    <div className="min-h-screen bg-gray-50">
      <UIToast notifications={notifications} onRemove={removeNotification} />

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartPage searchTerm={debouncedSearchTerm} />
        )}
      </main>
    </div>
  );
};

export default App;
