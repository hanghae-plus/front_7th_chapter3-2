import { useState } from "react";
import { Coupon } from "../../../types";
import { CouponList } from "./CouponList";
import { CouponForm } from "./CouponForm";

interface CouponManagementProps {
  coupons: Coupon[];
  onAdd: (coupon: Coupon) => void;
  onDelete: (code: string) => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({
  coupons,
  onAdd,
  onDelete,
  addNotification,
}) => {
  const [showCouponForm, setShowCouponForm] = useState(false);

  const handleSubmit = (coupon: Coupon) => {
    onAdd(coupon);
    setShowCouponForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          <button
            onClick={() => setShowCouponForm(!showCouponForm)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 쿠폰 추가
          </button>
        </div>
      </div>
      <div className="p-6">
        <CouponList coupons={coupons} onDelete={onDelete} />

        {showCouponForm && (
          <CouponForm
            onSubmit={handleSubmit}
            onCancel={() => setShowCouponForm(false)}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};
