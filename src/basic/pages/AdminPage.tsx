import { useState } from "react";
import { ADMIN_TABS, AdminTab } from "./admin/constants/tabs";
import { AdminNav } from "./admin/AdminNav";
import { AdminProducts } from "./admin/product/AdminProduct";
import { AdminCoupon } from "./admin/coupon/AdminCoupon";
import { CartItem, Coupon, ProductWithUI } from "../../types";

interface PageAdminProps {
  cart: CartItem[];
  products: ProductWithUI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithUI[]>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
}

export const AdminPage = ({
  cart,
  products,
  setProducts,
  handleNotificationAdd,
  coupons,
  setCoupons,
  selectedCoupon,
  setSelectedCoupon,
}: PageAdminProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(ADMIN_TABS.PRODUCTS);

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>
        <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === ADMIN_TABS.PRODUCTS ? (
          <AdminProducts
            cart={cart}
            products={products}
            setProducts={setProducts}
            handleNotificationAdd={handleNotificationAdd}
          />
        ) : (
          <AdminCoupon
            coupons={coupons}
            setCoupons={setCoupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            handleNotificationAdd={handleNotificationAdd}
          />
        )}
      </div>
    </>
  );
};
