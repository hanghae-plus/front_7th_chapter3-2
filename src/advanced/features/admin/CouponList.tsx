import { useState } from "react";
import { Coupon } from "../../../types";
import { CouponItem } from "./CouponItem";
import { CouponForm } from "./CouponForm";
import { useCouponStore } from "../../store/useCouponStore";
import { useNotificationStore } from "../../store/useNotificationStore";

export const CouponList = () => {
  const [showForm, setShowForm] = useState(false);

  // Store에서 상태 및 액션 가져오기
  const { coupons, addCoupon: addCouponAction, deleteCoupon: deleteCouponAction } =
    useCouponStore();
  const { addNotification } = useNotificationStore();

  // Notification 래퍼 함수들
  const handleAddCoupon = (coupon: Coupon) => {
    const result = addCouponAction(coupon);
    addNotification(result.message, result.success ? "success" : "error");
    setShowForm(false);
  };

  const handleDeleteCoupon = (code: string) => {
    const result = deleteCouponAction(code);
    addNotification(result.message, "success");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponItem
              key={coupon.code}
              item={coupon}
              onDelete={handleDeleteCoupon}
            />
          ))}

          {/* 추가 버튼 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showForm && (
          <CouponForm
            onSubmit={handleAddCoupon}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </section>
  );
};
