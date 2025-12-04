import { useMemo } from "react";
import { ADMIN_TABS, AdminTab } from "./admin/constants/tabs";
import { AdminNav } from "./admin/AdminNav";
import { AdminProducts } from "./admin/product/AdminProduct";
import { AdminCoupon } from "./admin/coupon/AdminCoupon";
import { useAtoms } from "../hooks/useAtoms";

// 탭 ID와 컴포넌트 및 props 매퍼 매핑
const TAB_CONFIG: Record<
  AdminTab,
  {
    component: React.ComponentType<any>;
  }
> = {
  [ADMIN_TABS.PRODUCTS]: {
    component: AdminProducts,
  },
  [ADMIN_TABS.COUPONS]: {
    component: AdminCoupon,
  },
};

export const PageAdmin = ({}) => {
  const { activeTab } = useAtoms();

  // 활성 탭에 해당하는 컴포넌트와 props 가져오기
  const { component: ActiveTabComponent } = useMemo(
    () => TAB_CONFIG[activeTab],
    [activeTab]
  );

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>
        <AdminNav />

        {ActiveTabComponent && <ActiveTabComponent />}
      </div>
    </>
  );
};
