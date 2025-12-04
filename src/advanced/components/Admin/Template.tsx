import ProductManagement from "./ProductManagement";
import CouponManagement from "./CouponManagement";
import AdminTabBar from "./AdminTabBar";

type Props = {
  activeTab: "products" | "coupons";
  setActiveTab: React.Dispatch<React.SetStateAction<"products" | "coupons">>;
};

const Template = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "products" ? <ProductManagement /> : <CouponManagement />}
    </div>
  );
};

export default Template;
