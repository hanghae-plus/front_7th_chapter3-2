import { useState } from "react";
import { Coupon } from "../../../../types";
import { AdminCouponForm } from "./AdminCouponForm";
import { AdminCouponList } from "./AdminCouponList";

interface AdminCouponProps {
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const AdminCoupon = ({
  coupons,
  setCoupons,
  selectedCoupon,
  setSelectedCoupon,
  handleNotificationAdd,
}: AdminCouponProps) => {
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <AdminCouponList
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          showCouponForm={showCouponForm}
          setCoupons={setCoupons}
          setSelectedCoupon={setSelectedCoupon}
          handleNotificationAdd={handleNotificationAdd}
          setShowCouponForm={setShowCouponForm}
        />

        {showCouponForm && (
          <AdminCouponForm
            coupons={coupons}
            setCoupons={setCoupons}
            setShowCouponForm={setShowCouponForm}
            handleNotificationAdd={handleNotificationAdd}
          />
        )}
      </div>
    </section>
  );
};
