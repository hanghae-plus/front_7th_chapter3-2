import { AdminDashboard } from './components/AdminDashboard';
import { Header } from '../../shared/component/Header';
import { useProduct } from '../../features/product/hook/useProduct';

interface AdminPageProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'warning',
  ) => void;
}

export const AdminPage = ({
  isAdmin,
  setIsAdmin,
  addNotification,
}: AdminPageProps) => {
  const { products, setProducts } = useProduct();

  return (
    <>
      <Header
        admin={{
          isAdmin,
          setIsAdmin,
        }}
        cart={{
          totalCartItemCount: 0,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AdminDashboard
          products={products}
          setProducts={setProducts}
          addNotification={addNotification}
        />
      </main>
    </>
  );
};
