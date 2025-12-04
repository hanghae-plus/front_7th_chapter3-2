import { useState } from "react";
import { UIToast } from "../components/ui/UIToast";
import { AdminTabs } from "../components/admin/AdminTabs";
import { ProductManagement } from "../components/admin/ProductManagement";
import { CouponManagement } from "../components/admin/CouponManagement";
import { useProducts } from "../hooks/useProducts";
import { useCoupons } from "../hooks/useCoupons";
import { useNotification } from "../hooks/useNotification";

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  // 알림 훅
  const { notifications, addNotification, removeNotification } =
    useNotification();

  // 상품 관리 훅 (관리자 모드)
  const {
    products,
    getFormattedPrice,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  } = useProducts("", addNotification, true);

  // 쿠폰 관리 훅
  const { coupons, addCoupon, removeCoupon } =
    useCoupons(addNotification);

  // 가격 포맷팅
  const formatPrice = (price: number, productId?: string) =>
    getFormattedPrice(price, productId, []);

  return (
    <>
      <UIToast notifications={notifications} onClose={removeNotification} />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "products" ? (
          <ProductManagement
            products={products}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        ) : (
          <CouponManagement
            coupons={coupons}
            onAdd={addCoupon}
            onDelete={removeCoupon}
            addNotification={addNotification}
          />
        )}
      </div>
    </>
  );
};

