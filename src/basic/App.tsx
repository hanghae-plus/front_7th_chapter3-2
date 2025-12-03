import { useState, useEffect } from "react";
import { Coupon } from "../types";
import { NotificationArea } from "./domains/notifications/components/NotificationArea";
import { Header } from "./shared/layout/components/Header";
import { AdminPage } from "./pages/admin/AdminPage";
import { ShopPage } from "./pages/shop/ShopPage";
import { useCart } from "./domains/cart/hooks/useCart";
import { addNotification } from "./domains/notifications/utils/addNotification";
import { ProductWithUI } from "./domains/products/types/ProductWithUI";
import { initialProducts } from "./domains/products/constants/initialProducts";
import { initialCoupons } from "./domains/coupon/constants/initialCoupons";
import { useProducts } from "./domains/products/hooks/useProducts";
import { useCoupons } from "./domains/coupon/hooks/useCoupon";
import { CartIcon } from "./shared/components/icons/CartIcon";

const App = () => {
  const products = useProducts();
  const coupons = useCoupons();
  const cart = useCart();

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationArea />

      <Header
        title="SHOP"
        middleAccessory={
          !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <input
                type="text"
                onChange={(e) => products.search(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )
        }
        rightAccessory={
          <>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </button>
            {!isAdmin && (
              <div className="relative">
                <CartIcon />
                {cart.list.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.totalItemCount}
                  </span>
                )}
              </div>
            )}
          </>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage products={products} coupons={coupons} />
        ) : (
          <ShopPage cart={cart} products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
