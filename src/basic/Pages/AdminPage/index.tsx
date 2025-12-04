import { useState, type FC } from "react";
import ProductManagement from "./ProductManagement";
import CouponManagement from "./CouponManagement";
import NaviTab from "./NaviTab";
import { Notification } from "../../models/notificiation";
import AdminHeader from "../../components/layout/AdminHeader";

interface IProps {
  onChange: () => void;
  addNotification: (message: string, type: Notification["type"]) => void;
}

const AdminPage: FC<IProps> = ({ addNotification, onChange }) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  return (
    <>
      <AdminHeader onChange={onChange} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 mt-1">
              상품과 쿠폰을 관리할 수 있습니다
            </p>
          </div>
          <NaviTab activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "products" ? (
            <ProductManagement addNotification={addNotification} />
          ) : (
            <CouponManagement addNotification={addNotification} />
          )}
        </div>
      </main>
    </>
  );
};

export default AdminPage;
