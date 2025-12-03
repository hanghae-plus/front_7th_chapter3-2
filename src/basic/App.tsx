import { useState } from "react";

import { Header, AdminPage, CartPage } from "./components/layout";
import { ToastContainer } from "./components/toast";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useDebounce } from "./utils/hooks/useDebounce";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { cart } = useCart();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();

  // const {} = useDebounce();

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
          />
        ) : (
          <CartPage products={products} cart={cart} />
        )}
      </main>
    </div>
  );
};

export default App;
