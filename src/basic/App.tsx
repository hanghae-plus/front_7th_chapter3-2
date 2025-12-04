import { useState } from "react";

import { Header, AdminPage, CartPage } from "./components/layout";
import { ToastContainer } from "./components/toast";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useDebounce } from "./utils/hooks/useDebounce";
import { SearchBar } from "./components/search";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebounce("");

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    calcItemTotal,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    totals,
    remainingStock,
    addToCart,
    completeOrder,
  } = useCart();
  const { coupons, addCoupon, deleteCoupon } = useCoupons(selectedCoupon, setSelectedCoupon);
  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer />
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} cart={cart}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Header>
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            remainingStock={remainingStock}
            // selectedCoupon={selectedCoupon}
            // setSelectedCoupon={setSelectedCoupon}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
          />
        ) : (
          <CartPage
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
            calcItemTotal={calcItemTotal}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            totals={totals}
            completeOrder={completeOrder}
            searchTerm={debouncedSearchTerm}
            products={products}
            addToCart={addToCart}
            remainingStock={remainingStock}
          />
        )}
      </main>
    </div>
  );
};

export default App;
