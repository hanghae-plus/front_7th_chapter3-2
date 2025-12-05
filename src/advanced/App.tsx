import { useState } from 'react';
import { HeaderWidget } from './widgets/header/ui/HeaderWidget';
import { ShopPage } from './pages/ShopPage';
import { AdminPage } from './pages/AdminPage';
import { useToast } from './shared/hooks/useToast';
import { useDebounce } from './shared/hooks/useDebounce';
import { Toast } from './shared/ui/Toast';

const App = () => {
  const { toasts, removeToast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              variant={toast.type}
              onClose={() => removeToast(toast.id)}
            >
              {toast.message}
            </Toast>
          ))}
        </div>
      )}

      {/* Header */}
      <HeaderWidget
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <ShopPage searchTerm={debouncedSearchTerm} />
        )}
      </main>
    </div>
  );
};

export default App;
