import { useState } from "react";
import { Coupon, ProductWithUI } from "../../../types";
import { TabNavigation } from "./components/TabNavigation";
import { ProductManagement } from "./components/ProductManagement";
import { CouponManagement } from "./components/CouponManagement";

type AdminPageProps = {
  products: {
    value: ProductWithUI[];
    add: (p: Omit<ProductWithUI, "id">) => void;
    update: (id: string, updates: Partial<ProductWithUI>) => void;
    delete: (id: string) => void;
  };
  coupons: {
    value: Coupon[];
    add: (newCoupon: Coupon) => void;
    remove: (code: string) => void;
  };
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
};

export function AdminPage({
  products,
  coupons,
  addNotification,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <ProductManagement
          products={products}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagement coupons={coupons} addNotification={addNotification} />
      )}
    </div>
  );
}
