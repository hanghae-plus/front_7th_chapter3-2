import { useState } from "react";
import AdminPage from "./components/AdminPage";
import { useNotification } from "./hooks/useNotification";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useSearch } from "./hooks/useSearch";
import { Notifications } from "./components/Notifications";
import { Header } from "./components/header";
import { SearchBar } from "./components/header/SearchBar";
import { ToggleButton } from "./components/header/ToggleButton";
import { CartIcon } from "./components/header/CartIcon";
import { useCart } from "./hooks/useCart";
import CartPage from "./components/CartPage";

const App = () => {
  // 검색 기능
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch(500);

  const { filterProductsBySearchTerm } = useProducts();

  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    isDuplicateCoupon,
    toggleCouponForm,
    applyCoupon,
  } = useCoupons();

  const [isAdmin, setIsAdmin] = useState(false);

  // const totals = calculateCartTotal(selectedCoupon);
  // 검색어로 상품 필터링

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />
      <Header
        leftSide={
          !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          )
        }
        rightSide={
          <nav className="flex items-center space-x-4">
            <ToggleButton isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            {!isAdmin && <CartIcon />}
          </nav>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            //coupons
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            isDuplicateCoupon={isDuplicateCoupon}
            toggleCouponForm={toggleCouponForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
          />
        ) : (
          <CartPage
            debouncedSearchTerm={debouncedSearchTerm}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </main>
    </div>
  );
};

export default App;
