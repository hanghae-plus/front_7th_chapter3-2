import { AdminDashboard } from './components/AdminDashboard';
import { Header } from '../../shared/component/Header';
import { useProduct } from '../../features/product/hooks/useProduct';

export const AdminPage = () => {
  const { products, setProducts } = useProduct();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AdminDashboard products={products} setProducts={setProducts} />
      </main>
    </>
  );
};
