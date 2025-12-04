import { useState, useMemo } from "react";
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

// 탭 ID와 컴포넌트 및 props 매퍼 매핑
const TAB_CONFIG: Record<
  AdminTab,
  {
    component: React.ComponentType<any>;
    getProps: (allProps: PageAdminProps) => any;
  }
> = {
  [ADMIN_TABS.PRODUCTS]: {
    component: AdminProducts,
    getProps: ({ cart, products, setProducts, handleNotificationAdd }) => ({
      cart,
      products,
      setProducts,
      handleNotificationAdd,
    }),
  },
  [ADMIN_TABS.COUPONS]: {
    component: AdminCoupon,
    getProps: ({
      coupons,
      setCoupons,
      selectedCoupon,
      setSelectedCoupon,
      handleNotificationAdd,
    }) => ({
      coupons,
      setCoupons,
      selectedCoupon,
      setSelectedCoupon,
      handleNotificationAdd,
    }),
  },
};

export const PageAdmin = ({
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

  // 활성 탭에 해당하는 컴포넌트와 props 가져오기
  const { component: ActiveTabComponent, getProps } = useMemo(
    () => TAB_CONFIG[activeTab],
    [activeTab]
  );

  // 컴포넌트에 전달할 props 준비
  const componentProps = useMemo(
    () =>
      getProps({
        cart,
        products,
        setProducts,
        handleNotificationAdd,
        coupons,
        setCoupons,
        selectedCoupon,
        setSelectedCoupon,
      }),
    [
      getProps,
      cart,
      products,
      setProducts,
      handleNotificationAdd,
      coupons,
      setCoupons,
      selectedCoupon,
      setSelectedCoupon,
    ]
  );

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>
        <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {ActiveTabComponent && <ActiveTabComponent {...componentProps} />}
      </div>
    </>
  );
};
